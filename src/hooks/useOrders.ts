import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/order";
import { playNotificationSound } from "@/utils/notificationSound";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pedidos_karaiba")
        .select("*")
        .order("data_hora_pedido", { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar pedidos:", error);
        toast({
          title: "Erro ao carregar pedidos",
          description: "Tente recarregar a página",
          variant: "destructive"
        });
        return;
      }
      
      setOrders(data || []);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const setupRealtimeUpdates = useCallback(() => {
    const channel = supabase.channel("orders-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "pedidos_karaiba"
    }, payload => {
      console.log("Realtime update:", payload);
      if (payload.eventType === "INSERT") {
        const newOrder = payload.new as Order;
        setOrders(prev => [newOrder, ...prev]);

        if (newOrder.status === "Pendente") {
          playNotificationSound();
          toast({
            title: "Novo Pedido!",
            description: `Pedido de ${newOrder.nome_cliente} - ${newOrder.codigo_pedido}`
          });
        }
      } else if (payload.eventType === "UPDATE") {
        const updatedOrder = payload.new as Order;
        setOrders(prev => prev.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ));
        console.log("Order updated in real-time:", updatedOrder);
      } else if (payload.eventType === "DELETE") {
        setOrders(prev => prev.filter(order => order.id !== payload.old.id));
      }
    }).subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string, entregadorName?: string) => {
    try {
      console.log("Updating order status:", orderId, "to:", newStatus);
      
      // Normalizar nome do entregador
      // - remove acentos/diacríticos (á, â, ã, ç, etc.)
      // - mantém apenas letras e espaços
      // - converte para minúsculas e remove espaços duplicados
      const sanitizeDelivererName = (name: string) => {
        const withoutDiacritics = name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const onlyLettersAndSpaces = withoutDiacritics.replace(/[^a-zA-Z\s]/g, '');
        return onlyLettersAndSpaces.toLowerCase().replace(/\s+/g, ' ').trim();
      };

      const currentOrder = orders.find(o => o.id === orderId) || null;
      // Nome do entregador a persistir (quando aplicável)
      let entregador: string | undefined = entregadorName ? sanitizeDelivererName(entregadorName) : undefined;
      // Para retirada (sem endereço) marcada como Entregue/Retirado, usar o usuário logado como entregador
      if (!entregador && (newStatus === "Entregue" || newStatus === "Retirado") && currentOrder && !currentOrder.endereco_completo) {
        try {
          const savedUser = localStorage.getItem("karaiba_user");
          if (savedUser) {
            const parsed = JSON.parse(savedUser) as { nome?: string; usuario?: string };
            const nomePreferencial = parsed?.nome || parsed?.usuario || "";
            entregador = nomePreferencial ? sanitizeDelivererName(nomePreferencial) : undefined;
          }
        } catch (e) {
          console.warn("Não foi possível obter usuário logado para marcar entregador na retirada.", e);
        }
      }

      const updatePayload: Record<string, unknown> = {
        status: newStatus,
        ...(entregador ? { entregador } : {}),
      };
      if (newStatus === "Entregue" || newStatus === "Retirado") {
        updatePayload.codigo_validado_em = new Date().toISOString();
      }

      let { error } = await supabase
        .from("pedidos_karaiba")
        .update(updatePayload)
        .eq("id", orderId);

      // Fallback caso a tabela não tenha algumas colunas (ex.: codigo_validado_em, entregador_usuario)
      if (error) {
        console.warn("Tentando fallback de atualização sem colunas extras. Erro:", error);
        const fallbackPayload: Record<string, unknown> = {
          status: newStatus,
          ...(entregador ? { entregador } : {}),
          ...(newStatus === "Entregue" || newStatus === "Retirado" ? { codigo_validado_em: new Date().toISOString() } : {}),
        };
        const result = await supabase
          .from("pedidos_karaiba")
          .update(fallbackPayload)
          .eq("id", orderId);
        error = result.error;
        if (error) {
          console.error("Erro ao atualizar status (fallback):", error);
          toast({
            title: "Erro ao atualizar status",
            description: "Tente novamente",
            variant: "destructive"
          });
          return;
        }
      }

      // Atualizar localmente também para garantir resposta imediata
      setOrders(prev => prev.map(order => 
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              ...(entregador ? { entregador } : {}),
              ...(newStatus === "Entregue" || newStatus === "Retirado" ? { codigo_validado_em: new Date().toISOString() } : {}),
            }
          : order
      ));

      let webhookUrl = "";
      if (newStatus === "Confirmado") {
        webhookUrl = "https://zzotech-n8n.lgctvv.easypanel.host/webhook/pedidoconfirmado";
      } else if (newStatus === "Saiu para entrega") {
        webhookUrl = "https://zzotech-n8n.lgctvv.easypanel.host/webhook/saiupentrega";
      } else if (newStatus === "Pronto para retirada") {
        webhookUrl = "https://zzotech-n8n.lgctvv.easypanel.host/webhook/prontopararetirada";
      } else if (newStatus === "Entregue" || newStatus === "Retirado") {
        webhookUrl = ""; // Sem webhook definido para entregue no momento
      }
      
      if (webhookUrl) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          try {
            const webhookData = {
              nome_cliente: order.nome_cliente,
              telefone: order.telefone,
              codigo_pedido: order.codigo_pedido,
              id: order.id
            };
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(webhookData)
            });
          } catch (webhookError) {
            console.error("Erro no webhook:", webhookError);
          }
        }
      }
      
      toast({
        title: "Status atualizado!",
        description: `Pedido alterado para: ${newStatus}`
      });
    } catch (error) {
      console.error("Erro:", error);
    }
  }, [orders, toast]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    setupRealtimeUpdates,
    updateOrderStatus,
    deleteOrder
  };
};