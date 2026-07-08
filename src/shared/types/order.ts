export interface IOrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  totalAmount: number;
  shippingPrice: number;
  taxPrice: number;
  paymentIntentId?: string;
  shippingCarrier?: string;
  shippingService?: string;
  trackingNumber?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}
