import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Printer, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Order } from "@/types/order";
import { formatCurrency, calculateTotal } from "@/utils/currencyUtils";
import { formatTime } from "@/utils/dateUtils";
import OrderStatusBadge from "./OrderStatusBadge";
import ProtectedPhone from "./ProtectedPhone";
import DeleteOrderModal from "./DeleteOrderModal";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useUserPermissions } from "@/hooks/useUserPermissions";

interface CollapsedOrderCardProps {
  order: Order;
  onPrint: (order: Order) => void;
  onDelete?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: string, entregador?: string) => void;
}

const CollapsedOrderCard = ({ order, onPrint, onDelete, onStatusChange }: CollapsedOrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTypingPickupCode, setIsTypingPickupCode] = useState(false);
  const [pickupCode, setPickupCode] = useState("");
  const { userName } = useUserPermissions();

  const handleDelete = async (orderId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch('https://zzotech-n8n.lgctvv.easypanel.host/webhook/deletarpedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: orderId }),
      });

      if (response.ok) {
        toast({
          title: "Pedido excluído",
          description: "O pedido foi excluído com sucesso.",
        });
        onDelete?.(orderId);
      } else {
        throw new Error('Erro ao excluir pedido');
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">
              {order.nome_cliente || "Cliente não informado"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {order.bairro || "Bairro não informado"}
            </p>
            <p className="text-xs text-muted-foreground">
              Pedido: {order.codigo_pedido || "N/A"}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 px-3 pb-3">
        {order.status === "Entregue" && (
          <div className="text-xs">
            <p className="text-emerald-700 font-medium">Entregue por: <span className="capitalize">{order.entregador || "N/I"}</span></p>
            <p className="text-muted-foreground">Horário da entrega: {order.codigo_validado_em ? formatTime(order.codigo_validado_em) : "N/I"}</p>
          </div>
        )}
        {order.status === "Retirado" && (
          <div className="text-xs">
            <p className="text-emerald-700 font-medium">Retirado com: <span className="capitalize">{userName || "N/I"}</span></p>
            <p className="text-muted-foreground">Horário da retirada: {order.codigo_validado_em ? formatTime(order.codigo_validado_em) : "N/I"}</p>
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-xs py-1 h-6"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3 mr-1" />
              - Detalhes
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 mr-1" />
              + Detalhes
            </>
          )}
        </Button>

        {/* Ação de entrega (retirada) visível diretamente no card colapsado */}
        {order.status === "Pronto para retirada" && !order.endereco_completo && onStatusChange && (
          <div className="mt-2">
            {!isTypingPickupCode ? (
              <Button
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 h-7"
                onClick={() => setIsTypingPickupCode(true)}
              >
                Entregar
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="text-[11px] text-muted-foreground">Digite o código do cliente para confirmar a retirada</div>
                <Input
                  placeholder="Código do cliente"
                  value={pickupCode}
                  onChange={(e) => setPickupCode(e.target.value)}
                  className="h-8 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full"
                    onClick={() => { setIsTypingPickupCode(false); setPickupCode(""); }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 w-full"
                    onClick={() => {
                      const toAlphaNum = (v: unknown) => (v ?? "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");
                      const toDigits = (v: unknown) => (v ?? "").toString().replace(/\D/g, "").replace(/^0+/, "");
                      const expectedA = toAlphaNum(order.codigo_entrega ?? order.codigo_pedido);
                      const typedA = toAlphaNum(pickupCode);
                      const expectedD = toDigits(order.codigo_entrega ?? order.codigo_pedido);
                      const typedD = toDigits(pickupCode);
                      const matchesAlphaNum = !!typedA && !!expectedA && typedA === expectedA;
                      const matchesDigits = !!typedD && !!expectedD && (typedD === expectedD || expectedD.endsWith(typedD));
                      if (matchesAlphaNum || matchesDigits) {
                        onStatusChange(order.id, "Retirado");
                        setIsTypingPickupCode(false);
                        setPickupCode("");
                      } else {
                        toast({
                          title: "Código inválido",
                          description: "O código digitado não confere com o do pedido.",
                          variant: "destructive",
                        });
                      }
                    }}
                    disabled={!pickupCode.trim()}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="space-y-2 animate-fade-in">
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-medium">📞</span>
                <ProtectedPhone phone={order.telefone} className="text-xs" />
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-medium">📍</span>
                <span className="text-xs leading-relaxed">
                  {order.endereco_completo || "Retirada"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <h4 className="font-medium text-xs">Itens:</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {order.itens || "Itens não informados"}
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">Valor do pedido:</span>
                <span>R$ {formatCurrency(order.valor_pedido)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Taxa de entrega:</span>
                <span>R$ {formatCurrency(order.taxa_entrega)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-sm text-primary">
                <span>TOTAL:</span>
                <span>R$ {calculateTotal(order.valor_total, order.valor_pedido, order.taxa_entrega)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pagamento:</span>
                <span>{order.forma_pagamento || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span>
                Tempo estimado: {order.tempo_entrega_estimado || "Não informado"}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Pedido em: {formatTime(order.data_hora_pedido)}</p>
            </div>

            {false && order.status === "Entregue" && (
              <div className="text-xs"></div>
            )}

            <Separator />

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPrint(order)}
                className="flex-1 text-xs py-1 h-6"
              >
                <Printer className="w-3 h-3 mr-1" />
                Imprimir (2 vias)
              </Button>
              
              {onDelete && (
                <DeleteOrderModal 
                  order={order}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollapsedOrderCard;