import React, { useState, createContext, useContext } from 'react';
import { Order } from '../types';
import { sampleOrders } from '../data/sampleOrders';
interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, patch: Partial<Order>) => void;
  findOrder: (orderId: string, email: string) => Order | undefined;
  getOrderById: (orderId: string) => Order | undefined;
}
const OrderContext = createContext<OrderContextValue | undefined>(undefined);
let orderCounter = 10235;
export function generateOrderId(): string {
  orderCounter += 1;
  return `ALW-${orderCounter}`;
}
export function OrderProvider({ children }: {children: ReactNode;}) {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };
  const updateOrder = (orderId: string, patch: Partial<Order>) => {
    setOrders((prev) =>
    prev.map((o) => o.id === orderId ? { ...o, ...patch } : o)
    );
  };
  const findOrder = (orderId: string, email: string) => {
    const normalizedId = orderId.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    return orders.find(
      (o) =>
      o.id.toLowerCase() === normalizedId &&
      (o.email ?? '').toLowerCase() === normalizedEmail
    );
  };
  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        findOrder,
        getOrderById
      }}>
      
      {children}
    </OrderContext.Provider>);

}
export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}