
import { Order } from "@/types/order";
import CollapsedOrderCard from "./CollapsedOrderCard";
import ExpandedOrderCard from "./ExpandedOrderCard";

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: string, entregador?: string) => void;
  onPrint: (order: Order) => void;
  onDelete?: (orderId: string) => void;
}

const OrderCard = ({ order, onStatusChange, onPrint, onDelete }: OrderCardProps) => {
  // Card resumido para "Saiu para entrega", "Pronto para retirada", "Entregue" e "Retirado"
  if (order.status === "Saiu para entrega" || order.status === "Pronto para retirada" || order.status === "Entregue" || order.status === "Retirado") {
    return <CollapsedOrderCard order={order} onPrint={onPrint} onDelete={onDelete} onStatusChange={onStatusChange} />;
  }

  // Card completo para "Pendente" e "Confirmado"
  return (
    <ExpandedOrderCard 
      order={order} 
      onStatusChange={onStatusChange} 
      onPrint={onPrint} 
      onDelete={onDelete}
    />
  );
};

export default OrderCard;
