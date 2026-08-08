import type { SalesByDay, SalesByProduct, SalesByCategory, SalesSummary } from "@/modules/admin/types/analytics";

export async function fetchSalesSummary(): Promise<SalesSummary | null> {
  try {
    const res = await fetch("/api/admin/sales");
    const data = await res.json();
    if (data.success && data.data?.summary) return data.data.summary;
    return null;
  } catch {
    return null;
  }
}

export async function fetchSalesByDay(days: number = 30): Promise<SalesByDay[]> {
  try {
    const res = await fetch(`/api/admin/sales?days=${days}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data?.byDay)) return data.data.byDay;
    return [];
  } catch {
    return [];
  }
}

export async function fetchSalesByProduct(): Promise<SalesByProduct[]> {
  try {
    const res = await fetch("/api/admin/sales/products");
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}

export async function fetchSalesByCategory(): Promise<SalesByCategory[]> {
  try {
    const res = await fetch("/api/admin/sales/categories");
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) return data.data;
    return [];
  } catch {
    return [];
  }
}
