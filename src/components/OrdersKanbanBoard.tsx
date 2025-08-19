import OrderCard from "@/components/OrderCard";
import { Order } from "@/types/order";
import { getPendingOrders, getConfirmedOrders, getConfirmedForDeliveryOrders, getDeliveredOrdersToday } from "@/utils/orderFilters";

interface OrdersKanbanBoardProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: string, entregador?: string) => void;
  onPrint: (order: Order) => void;
  onDelete?: (orderId: string) => void;
}

const OrdersKanbanBoard = ({ orders, onStatusChange, onPrint, onDelete }: OrdersKanbanBoardProps) => {
  const pendingOrders = getPendingOrders(orders);
  const confirmedOrders = getConfirmedOrders(orders);
  const confirmedForDeliveryOrders = getConfirmedForDeliveryOrders(orders);
  const deliveredOrders = getDeliveredOrdersToday(orders);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Coluna Pendente */}
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="text-status-pending-foreground p-3 rounded-t-lg bg-neutral-300">
            <h2 className="font-semibold text-sm">
              Pendente ({pendingOrders.length})
            </h2>
          </div>
          <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {pendingOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={onStatusChange} 
                onPrint={onPrint} 
                onDelete={onDelete}
              />
            ))}
            {pendingOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Nenhum pedido pendente
              </p>
            )}
          </div>
        </div>

        {/* Coluna Confirmado */}
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="text-white p-3 rounded-t-lg bg-yellow-700">
            <h2 className="font-semibold text-sm">
              Confirmado ({confirmedOrders.length})
            </h2>
          </div>
          <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {confirmedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={onStatusChange} 
                onPrint={onPrint} 
                onDelete={onDelete}
              />
            ))}
            {confirmedOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Nenhum pedido confirmado
              </p>
            )}
          </div>
        </div>

        {/* Coluna Pronto para Entrega/Retirada */}
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="bg-status-delivery text-status-delivery-foreground p-3 rounded-t-lg">
            <h2 className="font-semibold text-sm">
              Pronto para Entrega/Retirada ({confirmedForDeliveryOrders.length})
            </h2>
          </div>
          <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {confirmedForDeliveryOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={onStatusChange} 
                onPrint={onPrint} 
                onDelete={onDelete}
              />
            ))}
            {confirmedForDeliveryOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Nenhum pedido pronto para entrega/retirada hoje
              </p>
            )}
          </div>
        </div>

        {/* Coluna Entregue/Retirado - Hoje */}
        <div className="bg-card rounded-lg shadow-sm border">
          <div className="bg-emerald-600 text-white p-3 rounded-t-lg">
            <h2 className="font-semibold text-sm">
              Entregue/Retirado - Hoje ({deliveredOrders.length})
            </h2>
          </div>
          <div className="p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {deliveredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStatusChange={onStatusChange} 
                onPrint={onPrint} 
                onDelete={onDelete}
              />
            ))}
            {deliveredOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Nenhum pedido entregue hoje
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersKanbanBoard;