import { Order } from "@/types/order";

export const getPendingOrders = (orders: Order[]) => 
  orders.filter(order => order.status === "Pendente");

export const getConfirmedOrders = (orders: Order[]) => 
  orders.filter(order => order.status === "Confirmado");

export const getConfirmedForDeliveryOrders = (orders: Order[]) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return orders.filter(order => {
    if (order.status !== "Saiu para entrega" && order.status !== "Pronto para retirada") return false;
    const orderDate = new Date(order.data_hora_pedido);
    const orderDateStr = orderDate.toISOString().split('T')[0];
    return orderDateStr === todayStr;
  });
};

export const getDeliveredOrdersToday = (orders: Order[]) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return orders.filter(order => {
    if (order.status !== "Entregue" && order.status !== "Retirado") return false;
    const baseDate = order.codigo_validado_em || order.data_hora_pedido;
    const deliveryDateStr = new Date(baseDate).toISOString().split('T')[0];
    return deliveryDateStr === todayStr;
  });
};