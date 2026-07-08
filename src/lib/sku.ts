export function generateSKU(params: {
  categoryCode?: string;
  brandCode?: string;
  color?: string;
  size?: string;
  variantIndex?: number;
}): string {
  const prefix = params.categoryCode || "GEN";
  const brand = params.brandCode ? params.brandCode.substring(0, 3).toUpperCase() : "XX";
  const color = params.color ? params.color.substring(0, 2).toUpperCase() : "";
  const size = params.size ? params.size.toUpperCase().replace(/[^A-Z0-9]/g, "") : "";
  const index = params.variantIndex !== undefined ? `-${String(params.variantIndex + 1).padStart(3, "0")}` : "";
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${brand}${color}${size}${index}-${rand}`;
}

export function extractVariantInfo(sku: string): {
  color?: string;
  size?: string;
} {
  const parts = sku.split("-");
  const body = parts.length >= 2 ? parts[1] : "";
  const colorMatch = body.match(/^[A-Z]{2}([A-Z]+)/);
  const sizeMatch = body.match(/(\d+[A-Z]*)$/);
  return {
    color: colorMatch ? colorMatch[1] : undefined,
    size: sizeMatch ? sizeMatch[1] : undefined,
  };
}
