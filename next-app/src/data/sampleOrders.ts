import { Order } from '../types';

// Pre-seeded orders so Track Order has data to demo without requiring a fresh checkout.
export const sampleOrders: Order[] = [
{
  id: 'ALW-10234',
  date: '2026-06-28',
  customer: 'Ayesha Khan',
  email: 'ayesha.khan@example.com',
  phone: '0300-1234567',
  shippingAddress: {
    line1: 'House 12, Street 4, DHA Phase 5',
    city: 'Lahore'
  },
  items: [
  {
    productId: 'p1',
    name: 'Wireless Noise-Cancelling Over-Ear Headphones',
    image:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
    price: 9199,
    qty: 1
  }],

  subtotal: 9199,
  discount: 0,
  shipping: 0,
  total: 9199,
  paymentMethod: 'COD',
  paymentStatus: 'Pending',
  fulfillmentStatus: 'Shipped',
  trackingNumber: 'TRK-88213PK'
},
{
  id: 'ALW-10198',
  date: '2026-06-20',
  customer: 'Bilal Ahmed',
  email: 'bilal.ahmed@example.com',
  phone: '0311-9876543',
  shippingAddress: { line1: 'Flat 3B, Clifton Block 2', city: 'Karachi' },
  items: [
  {
    productId: 'p6',
    name: 'Ceramic Non-Stick Cookware Set (5-Piece)',
    image:
    'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=200&q=80',
    price: 11999,
    qty: 1
  },
  {
    productId: 'p3',
    name: 'Stainless Steel Insulated Travel Mug 500ml',
    image:
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=200&q=80',
    price: 1650,
    qty: 2
  }],

  subtotal: 15299,
  discount: 500,
  shipping: 0,
  total: 14799,
  paymentMethod: 'BankTransfer',
  paymentStatus: 'AwaitingVerification',
  fulfillmentStatus: 'Pending'
},
{
  id: 'ALW-10061',
  date: '2026-06-05',
  customer: 'Sara Malik',
  email: 'sara.malik@example.com',
  phone: '0321-4567890',
  shippingAddress: { line1: 'B-45, Gulberg III', city: 'Lahore' },
  items: [
  {
    productId: 'p2',
    name: 'Smart Fitness Watch with Heart Rate Monitor',
    image:
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80',
    price: 6800,
    qty: 1
  }],

  subtotal: 6800,
  discount: 0,
  shipping: 250,
  total: 7050,
  paymentMethod: 'Stripe',
  paymentStatus: 'Paid',
  fulfillmentStatus: 'Delivered',
  trackingNumber: 'TRK-77102PK'
}];