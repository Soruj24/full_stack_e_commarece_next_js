import {
  MarketingCoupon,
  MarketingBanner,
  SaleProduct,
  NewCouponForm,
  NewBannerForm,
} from "@/features/admin/types/marketing";

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

  const couponsData: CouponsResponse = await couponsRes.json();
  const bannersData: BannersResponse = await bannersRes.json();
  const productsData: ProductsResponse = await productsRes.json();

  return {
    coupons: couponsData.success ? couponsData.coupons ?? [] : [],
    banners: bannersData.success ? bannersData.banners ?? [] : [],
    products: productsData.success ? productsData.products ?? [] : [],
  };
}

export async function createBanner(data: NewBannerForm): Promise<boolean> {
  const res = await fetch("/api/admin/marketing/banners", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: MutationResponse = await res.json();
  return json.success;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/marketing/banners?id=${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function toggleBannerStatus(
  id: string,
  currentStatus: boolean,
): Promise<boolean> {
  const res = await fetch("/api/admin/marketing/banners", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, isActive: !currentStatus }),
  });
  return res.ok;
}

export async function createCoupon(data: NewCouponForm): Promise<MutationResponse> {
  const res = await fetch("/api/admin/marketing/coupons", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCoupon(id: string): Promise<boolean> {
  const res = await fetch(`/api/admin/marketing/coupons?id=${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function toggleCouponStatus(
  id: string,
  currentStatus: boolean,
): Promise<boolean> {
  const res = await fetch("/api/admin/marketing/coupons", {
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
  const res = await fetch(`/api/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ onSale, discountPrice }),
  });
  return res.ok;
}
