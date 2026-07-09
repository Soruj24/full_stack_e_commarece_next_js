import type { RevenueSummary, RevenueByPaymentMethod, RevenueForecast } from "@/modules/admin/types/analytics";

export async function fetchRevenueSummary(): Promise<RevenueSummary | null> {
  try {
    const res = await fetch("/api/admin/revenue");
    const data = await res.json();
    if (data.success && data.summary) return data.summary;
    return null;
  } catch {
    return null;
  }
}

export async function fetchRevenueByPaymentMethod(): Promise<RevenueByPaymentMethod[]> {
  try {
    const res = await fetch("/api/admin/revenue/payments");
    const data = await res.json();
    if (data.success && Array.isArray(data.paymentMethods)) return data.paymentMethods;
    return [];
  } catch {
    return [];
  }
}

export async function fetchRevenueForecast(): Promise<RevenueForecast[]> {
  try {
    const res = await fetch("/api/admin/revenue/forecast");
    const data = await res.json();
    if (data.success && Array.isArray(data.forecast)) return data.forecast;
    return [];
  } catch {
    return [];
  }
}
