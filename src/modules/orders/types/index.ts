export interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  shippingAddress: Record<string, string>;
  paymentMethod: string;
  totalAmount: number;
  currency: string;
  discount: number;
  couponCode?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
  user?: { _id: string; name: string; email: string };
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface ReturnItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  reason: string;
  condition: string;
}

export interface ReturnRequest {
  _id: string;
  orderId: { _id: string; orderNumber: string };
  items: ReturnItem[];
  status: string;
  reason: string;
  description: string;
  refundAmount: number;
  refundMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  notes: { by: string; message: string; createdAt: string }[];
}

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  currentStep: number;
  events: TrackingEvent[];
  lastUpdated: string;
}
