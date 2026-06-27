import { ShippingAddress } from "@/features/checkout/types/checkout";

export interface PaymentSettings {
  stripe: boolean; paypal: boolean; cod: boolean;
  bkash: boolean; nagad: boolean; rocket: boolean;
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  try {
    const res = await fetch("/api/settings");
    const data = await res.json();
    if (data.success && data.settings) {
      return {
        stripe: data.settings.stripeEnabled ?? true,
        paypal: data.settings.paypalEnabled ?? true,
        cod: data.settings.codEnabled ?? true,
        bkash: data.settings.bkashEnabled ?? true,
        nagad: data.settings.nagadEnabled ?? true,
        rocket: data.settings.rocketEnabled ?? true,
      };
    }
  } catch { /* silent fallback */ }
  return { stripe: true, paypal: true, cod: true, bkash: true, nagad: true, rocket: true };
}

interface CouponResult { success: boolean; discount?: number; error?: string }

export async function validateCoupon(code: string, subtotal: number): Promise<CouponResult> {
  const res = await fetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subtotal }),
  });
  return res.json();
}

export async function createPaymentIntent(amount: number, currency: string, itemCount: number) {
  const res = await fetch("/api/payments/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      currency: currency.toLowerCase(),
      metadata: { orderItems: itemCount },
    }),
  });
  return res.json();
}

export async function placeOrder(orderData: Record<string, unknown>, isGuest: boolean) {
  const endpoint = isGuest ? "/api/orders/guest" : "/api/orders";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  return { status: res.status, data };
}
