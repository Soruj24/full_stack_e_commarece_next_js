import { csrfFetch } from "@/lib/security/csrf-client";
import {
  MarketingCoupon,
  MarketingBanner,
  SaleProduct,
  NewCouponForm,
  NewBannerForm,
} from "@/modules/admin/types/marketing";

interface CouponsResponse {
  success: boolean;
  coupons?: MarketingCoupon[];
}

interface BannersResponse {
  success: boolean;
  banners?: MarketingBanner[];
}

interface ProductsResponse {
  success: boolean;
  products?: SaleProduct[];
}

interface MutationResponse {
  success: boolean;
  error?: string;
}

export async function fetchMarketingData() {
  const [couponsRes, bannersRes, productsRes] = await Promise.all([
    fetch("/api/admin/marketing/coupons"),
    fetch("/api/admin/marketing/banners"),
    fetch("/api/products?limit=100"),
  ]);

  const couponsData: CouponsResponse = couponsRes.ok ? await couponsRes.json() : { success: false };
  const bannersData: BannersResponse = bannersRes.ok ? await bannersRes.json() : { success: false };
  const productsData: ProductsResponse = productsRes.ok ? await productsRes.json() : { success: false };

  return {
    coupons: couponsData.success ? couponsData.coupons ?? [] : [],
    banners: bannersData.success ? bannersData.banners ?? [] : [],
    products: productsData.success ? productsData.products ?? [] : [],
  };
}

export async function createBanner(data: NewBannerForm): Promise<boolean> {
  const res = await csrfFetch("/api/admin/marketing/banners", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return false;
  const json: MutationResponse = await res.json();
  return json.success;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const res = await csrfFetch(`/api/admin/marketing/banners?id=${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function toggleBannerStatus(
  id: string,
  currentStatus: boolean,
): Promise<boolean> {
  const res = await csrfFetch("/api/admin/marketing/banners", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, isActive: !currentStatus }),
  });
  return res.ok;
}

export async function createCoupon(data: NewCouponForm): Promise<MutationResponse> {
  const res = await csrfFetch("/api/admin/marketing/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
  return res.json();
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const res = await csrfFetch(`/api/admin/marketing/coupons?id=${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function toggleCouponStatus(
  id: string,
  currentStatus: boolean,
): Promise<boolean> {
  const res = await csrfFetch("/api/admin/marketing/coupons", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, isActive: !currentStatus }),
  });
  return res.ok;
}

export async function toggleProductSale(
  productId: string,
  onSale: boolean,
  discountPrice?: number,
): Promise<boolean> {
  const res = await csrfFetch(`/api/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ onSale, discountPrice }),
  });
  return res.ok;
}
