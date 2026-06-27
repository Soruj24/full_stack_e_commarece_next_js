export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface BillingAddress extends ShippingAddress {}

export interface SavedAddress extends ShippingAddress {
  _id: string;
  label: string;
  isDefault: boolean;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  description: string;
  rate: number;
  carrier: string;
  service: string;
  estimatedDays: string;
  currency?: string;
}

export interface Coupon {
  code: string;
  discount: number;
  discountType: "percentage" | "fixed";
  minOrderValue?: number;
  maxDiscount?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
}

export interface CheckoutState {
  step: number;
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  selectedRate: ShippingRate | null;
  paymentMethod: string;
  coupon: Coupon | null;
  isGuestCheckout: boolean;
}

export interface CreateOrderRequest {
  items: {
    product: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  sameAsShipping?: boolean;
  currency: string;
  paymentMethod: string;
  paymentIntentId?: string;
  transactionId?: string;
  paymentPhoneNumber?: string;
  shippingPrice: number;
  shippingCarrier?: string;
  shippingService?: string;
  taxPrice: number;
  totalAmount: number;
  couponCode?: string;
  discount: number;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: {
    _id: string;
    orderNumber: string;
    totalAmount: number;
    status: string;
  };
  error?: string;
}

export interface ValidateCouponRequest {
  code: string;
  subtotal: number;
}

export interface ValidateCouponResponse {
  success: boolean;
  discount?: number;
  discountType?: "percentage" | "fixed";
  error?: string;
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  error?: string;
}

export type CheckoutStep = 
  | "account" 
  | "shipping" 
  | "delivery" 
  | "review" 
  | "payment" 
  | "confirmation";

export interface CheckoutStepConfig {
  id: CheckoutStep;
  label: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
}
