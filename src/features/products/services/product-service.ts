const BASE = "/api/products";

export async function fetchProduct(id: string) {
  const res = await fetch(`${BASE}/${id}`);
  const data = await res.json();
  if (data.success) return data.product;
  throw new Error(data.error || "Failed to fetch product");
}
