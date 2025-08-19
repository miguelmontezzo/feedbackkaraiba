import { Button } from "@/components/ui/button";
import { Check, Truck, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeliverers, Deliverer } from "@/hooks/useDeliverers";

interface OrderStatusActionsProps {
  status: string | null;
  orderId: string;
  onStatusChange: (orderId: string, status: string, entregador?: string) => void;
  hasAddress: boolean;
}

const OrderStatusActions = ({ status, orderId, onStatusChange, hasAddress }: OrderStatusActionsProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [nextStatus, setNextStatus] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");
  const { deliverers, loading } = useDeliverers();

  const startSelecting = (targetStatus: string) => {
    setIsSelecting(true);
    setNextStatus(targetStatus);
    setSelected("");
  };

  const confirm = () => {
    if (!nextStatus) return;
    if (!selected) return;
    onStatusChange(orderId, nextStatus, selected);
    
    setIsSelecting(false);
    setNextStatus(null);
  };

  const cancel = () => {
    setIsSelecting(false);
    setNextStatus(null);
    setSelected("");
  };
  if (status === "Pendente") {
    return (
      <Button
        size="sm"
        onClick={() => onStatusChange(orderId, "Confirmado")}
        className="w-full bg-status-confirmed hover:bg-status-confirmed/90 text-status-confirmed-foreground text-xs py-1 h-7"
      >
        <Check className="w-3 h-3 mr-1" />
        Confirmar
      </Button>
    );
  }
  
  if (status === "Confirmado") {
    // Para retirada (sem endereço), não exigir entregador
    if (!hasAddress) {
      return (
        <Button
          size="sm"
          onClick={() => onStatusChange(orderId, "Pronto para retirada")}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-7"
        >
          <Check className="w-3 h-3 mr-1" />
          Pronto para retirada
        </Button>
      );
    }

    if (isSelecting) {
      return (
        <div className="space-y-2">
          <div className="text-[11px] text-muted-foreground">Escolha o entregador para confirmar o status</div>

          {/* Seletor de entregadores */}
          {deliverers.length > 0 ? (
            <Select value={selected} onValueChange={(v) => { setSelected(v); }}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder={loading ? "Carregando..." : "Selecione o entregador"} />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-auto min-w-[12rem] max-w-[calc(100vw-16px)]">
                {deliverers.map((d) => (
                  <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-[11px] text-muted-foreground">Nenhum entregador disponível</div>
          )}

          {(selected) && (
            <div className="flex items-center gap-1 text-[11px]">
              <span className="rounded-full bg-accent px-2 py-0.5">{selected}</span>
              <button type="button" onClick={() => { setSelected(""); }} className="opacity-70 hover:opacity-100">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-8 w-full" onClick={cancel}>Cancelar</Button>
            <Button size="sm" className="h-8 w-full" onClick={confirm} disabled={loading || !selected}>
              Pedido pronto
            </Button>
          </div>
        </div>
      );
    }

    // Botão inicial que inicia seleção de entregador
    const targetStatus = hasAddress ? "Saiu para entrega" : "Pronto para retirada";
    const label = hasAddress ? (
      <>
        <Truck className="w-3 h-3 mr-1" />
        Saiu para entrega
      </>
    ) : (
      <>
        <Check className="w-3 h-3 mr-1" />
        Pronto para retirada
      </>
    );
    const className = hasAddress
      ? "w-full bg-status-delivery hover:bg-status-delivery/90 text-status-delivery-foreground text-xs py-1 h-7"
      : "w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-7";

    return (
      <Button size="sm" onClick={() => startSelecting(targetStatus)} className={className}>
        {label}
      </Button>
    );
  }
  
  if (status === "Saiu para entrega") {
    return (
      <Button
        size="sm"
        onClick={() => onStatusChange(orderId, "Entregue")}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 h-7"
      >
        <CheckCheck className="w-3 h-3 mr-1" />
        Marcar como entregue
      </Button>
    );
  }
  
  return null;
};

export default OrderStatusActions;