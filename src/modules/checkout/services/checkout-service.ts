import { csrfFetch } from "@/lib/security/csrf-client";

export interface PaymentSettings {
  stripe: boolean; paypal: boolean; cod: boolean;
  bkash: boolean; nagad: boolean; rocket: boolean;
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  try {
    const res = await fetch("/api/settings");
    if (!res.ok) return { stripe: true, paypal: true, cod: true, bkash: true, nagad: true, rocket: true };
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

export interface CouponResult { success: boolean; discount?: number; error?: string }

export async function validateCoupon(code: string, cartTotal: number): Promise<CouponResult> {
  const res = await csrfFetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, cartTotal }),
  });
  if (!res.ok) {
    return { success: false, error: `HTTP ${res.status}` };
  }
  const data = await res.json();
  if (data.success) {
    return { success: true, discount: data.coupon.discount };
  }
  return { success: false, error: data.error };
}

export async function createPaymentIntent(amount: number, currency: string, itemCount: number) {
  const res = await csrfFetch("/api/payments/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      currency: currency.toLowerCase(),
      metadata: { orderItems: itemCount },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || "Payment intent creation failed");
  }
  return res.json();
}

export async function placeOrder(orderData: Record<string, unknown>, isGuest: boolean) {
  const endpoint = isGuest ? "/api/orders/guest" : "/api/orders";
  const res = await csrfFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    return { status: res.status, data: { success: false, error: err.error || "Order failed" } };
  }
  const data = await res.json();
  return { status: res.status, data };
}
