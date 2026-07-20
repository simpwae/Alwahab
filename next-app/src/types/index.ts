export type ProductRibbon = 'New' | 'BestSeller' | 'none';
export type ProductStatus = 'Active' | 'Draft' | 'OutOfStock';

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  images: string[];
  sizes: string[];
  description: string;
  specs: string[];
  originalPrice: number;
  sellingPrice: number;
  discountPct: number;
  stockQty: number;
  lowStockThreshold: number;
  sku: string;
  unitsSold: number;
  rating: number;
  reviewCount: number;
  ribbon: ProductRibbon;
  status: ProductStatus;
  featured: boolean;
}

export type PaymentMethod = 'COD' | 'BankTransfer' | 'Stripe';
export type PaymentStatus =
'Paid' |
'AwaitingVerification' |
'Pending' |
'Failed';
export type FulfillmentStatus =
'Pending' |
'Confirmed' |
'Shipped' |
'Delivered' |
'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: string;
  email?: string;
  phone?: string;
  shippingAddress?: {
    line1: string;
    city: string;
  };
  couponCode?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  receiptImage?: string;
  trackingNumber?: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  city: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  wishlist: string[];
  joinedDate: string;
}

export interface Coupon {
  code: string;
  type: '%' | 'flat';
  value: number;
  minOrder: number;
  usageLimit: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expired' | 'Scheduled';
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Review {
  id: string;
  productId: string;
  customer: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
}