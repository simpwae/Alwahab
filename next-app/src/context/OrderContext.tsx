"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { Order, OrderItem } from '../types';
import { createClient } from '../lib/supabase/client';
import { useAuth } from './AuthContext';
import { useAdminAuth } from './AdminAuthContext';

const RATE_LIMIT_MESSAGE = 'Too many attempts. Please wait a few minutes and try again.';
function friendlyError(message: string) {
  return message.includes('rate_limit_exceeded') ? RATE_LIMIT_MESSAGE : message;
}

// orders/order_items RLS only allows a row's owner or an admin to SELECT it
// (orders_select_own_or_admin), and only an admin to UPDATE it
// (orders_write_admin) - so, unlike every other migrated context, "my
// orders" (customer session) and "all orders" (admin session) are genuinely
// different queries against different sessions, not the same data filtered
// differently. Splitting into two hooks (useOrders / useAdminOrders) avoids
// guessing which session a shared `orders` list should reflect when a
// browser happens to hold both at once (a real scenario during testing).
const customerSupabase = createClient('alwahab-customer-auth');
const adminSupabase = createClient('alwahab-admin-auth');

interface OrderItemRow {
  product_id: string;
  name: string;
  image: string | null;
  price: number;
  qty: number;
  size: string | null;
}

interface OrderRow {
  id: string;
  date: string;
  customer: string;
  email: string | null;
  phone: string | null;
  shipping_address: { line1: string; city: string } | null;
  coupon_code: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  payment_method: Order['paymentMethod'];
  payment_status: Order['paymentStatus'];
  fulfillment_status: Order['fulfillmentStatus'];
  receipt_image: string | null;
  tracking_number: string | null;
  order_items?: OrderItemRow[];
}

function itemFromRow(row: OrderItemRow): OrderItem {
  return { productId: row.product_id, name: row.name, image: row.image ?? '', price: row.price, qty: row.qty, size: row.size ?? undefined };
}

function fromRow(row: OrderRow): Order {
  return {
    id: row.id,
    date: row.date,
    customer: row.customer,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    shippingAddress: row.shipping_address ?? undefined,
    couponCode: row.coupon_code ?? undefined,
    items: (row.order_items ?? []).map(itemFromRow),
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    receiptImage: row.receipt_image ?? undefined,
    trackingNumber: row.tracking_number ?? undefined
  };
}

interface PlaceOrderInput {
  customer: string;
  email: string;
  phone: string;
  shippingAddress: { line1: string; city: string };
  couponCode?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: Order['paymentMethod'];
  paymentStatus: Order['paymentStatus'];
  receiptImage?: string;
  /** Overrides the logged-in user id — for attributing an order to an account created during the same checkout. */
  userId?: string;
}

interface CustomerOrdersValue {
  orders: Order[];
  getOrderById: (orderId: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Promise<{ order: Order | null; error: string | null }>;
  findOrder: (orderId: string, email: string) => Promise<Order | undefined>;
}

interface AdminOrdersValue {
  orders: Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrder: (orderId: string, patch: Partial<Order>) => Promise<string | null>;
  deleteOrder: (orderId: string) => Promise<string | null>;
  deleteOrders: (orderIds: string[]) => Promise<string | null>;
}

const CustomerOrdersContext = createContext<CustomerOrdersValue | undefined>(undefined);
const AdminOrdersContext = createContext<AdminOrdersValue | undefined>(undefined);

export function OrderProvider({ children }: {children: ReactNode;}) {
  const { user } = useAuth();
  const { admin } = useAdminAuth();

  const [myOrders, setMyOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!user) {
      setMyOrders([]);
      return;
    }
    customerSupabase.from('orders').select('*, order_items(*)').then(({ data }) => {
      setMyOrders((data ?? []).map((row) => fromRow(row as OrderRow)));
    });
  }, [user]);

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (!admin) {
      setAllOrders([]);
      return;
    }
    adminSupabase.from('orders').select('*, order_items(*)').then(({ data }) => {
      setAllOrders((data ?? []).map((row) => fromRow(row as OrderRow)));
    });
  }, [admin]);

  const placeOrder = async (input: PlaceOrderInput) => {
    const { data, error } = await customerSupabase.rpc('place_order', {
      p_user_id: input.userId ?? user?.id ?? null,
      p_customer: input.customer,
      p_email: input.email,
      p_phone: input.phone,
      p_shipping_address: input.shippingAddress,
      p_coupon_code: input.couponCode ?? null,
      p_subtotal: input.subtotal,
      p_discount: input.discount,
      p_shipping: input.shipping,
      p_total: input.total,
      p_payment_method: input.paymentMethod,
      p_payment_status: input.paymentStatus,
      p_receipt_image: input.receiptImage ?? null,
      p_items: input.items.map((i) => ({
        product_id: i.productId, name: i.name, image: i.image, price: i.price, qty: i.qty, size: i.size ?? null
      }))
    });
    if (error) return { order: null, error: friendlyError(error.message) };
    const row = data as OrderRow;
    const order: Order = {
      id: row.id,
      date: row.date,
      customer: row.customer,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      shippingAddress: row.shipping_address ?? undefined,
      couponCode: row.coupon_code ?? undefined,
      items: input.items,
      subtotal: row.subtotal,
      discount: row.discount,
      shipping: row.shipping,
      total: row.total,
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      fulfillmentStatus: row.fulfillment_status,
      receiptImage: row.receipt_image ?? undefined,
      trackingNumber: row.tracking_number ?? undefined
    };
    setMyOrders((prev) => [order, ...prev]);
    return { order, error: null };
  };

  const findOrder = async (orderId: string, email: string): Promise<Order | undefined> => {
    const [{ data: orderRows, error: orderError }, { data: itemRows, error: itemsError }] = await Promise.all([
    customerSupabase.rpc('find_guest_order', { p_order_id: orderId, p_email: email }),
    customerSupabase.rpc('find_guest_order_items', { p_order_id: orderId, p_email: email })]
    );
    if (orderError || itemsError) {
      toast.error(friendlyError((orderError ?? itemsError)!.message));
      return undefined;
    }
    if (!orderRows || orderRows.length === 0) return undefined;
    return fromRow({ ...(orderRows[0] as OrderRow), order_items: (itemRows ?? []) as OrderItemRow[] });
  };

  const updateOrder = async (orderId: string, patch: Partial<Order>) => {
    const row: Record<string, unknown> = {};
    if (patch.fulfillmentStatus !== undefined) row.fulfillment_status = patch.fulfillmentStatus;
    if (patch.paymentStatus !== undefined) row.payment_status = patch.paymentStatus;
    if (patch.trackingNumber !== undefined) row.tracking_number = patch.trackingNumber ?? null;
    const { error } = await adminSupabase.from('orders').update(row).eq('id', orderId);
    if (error) return error.message;
    setAllOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, ...patch } : o));
    return null;
  };

  const deleteOrder = async (orderId: string) => {
    const { error } = await adminSupabase.from('orders').delete().eq('id', orderId);
    if (error) return error.message;
    setAllOrders((prev) => prev.filter((o) => o.id !== orderId));
    return null;
  };

  const deleteOrders = async (orderIds: string[]) => {
    const { error } = await adminSupabase.from('orders').delete().in('id', orderIds);
    if (error) return error.message;
    const idSet = new Set(orderIds);
    setAllOrders((prev) => prev.filter((o) => !idSet.has(o.id)));
    return null;
  };

  const customerValue: CustomerOrdersValue = {
    orders: myOrders,
    getOrderById: (orderId) => myOrders.find((o) => o.id === orderId),
    placeOrder,
    findOrder
  };

  const adminValue: AdminOrdersValue = {
    orders: allOrders,
    getOrderById: (orderId) => allOrders.find((o) => o.id === orderId),
    updateOrder,
    deleteOrder,
    deleteOrders
  };

  return (
    <CustomerOrdersContext.Provider value={customerValue}>
      <AdminOrdersContext.Provider value={adminValue}>
        {children}
      </AdminOrdersContext.Provider>
    </CustomerOrdersContext.Provider>);

}

export function useOrders() {
  const ctx = useContext(CustomerOrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}

export function useAdminOrders() {
  const ctx = useContext(AdminOrdersContext);
  if (!ctx) throw new Error('useAdminOrders must be used within OrderProvider');
  return ctx;
}
