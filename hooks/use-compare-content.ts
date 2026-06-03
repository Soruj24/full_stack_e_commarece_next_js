import { useCompare, CompareProduct } from "@/context/CompareContext";
import { useCart } from "@/context/CartContext";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice, convertPrice } from "@/lib/localization";

export const ALL_SPECS = [
  { key: "price", label: "Price" },
  { key: "brand", label: "Brand" },
  { key: "stock", label: "Availability" },
  { key: "rating", label: "Rating" },
  { key: "reviews", label: "Reviews" },
  { key: "weight", label: "Weight" },
  { key: "dimensions", label: "Dimensions" },
  { key: "material", label: "Material" },
  { key: "warranty", label: "Warranty" },
];

export function useCompareContent() {
  const { products, removeProduct, clearAll, canAddMore } = useCompare();
  const { addToCart } = useCart();
  const { currency } = useLocalization();

  const getComparisonSpec = (key: string, productsToCompare: CompareProduct[]) => {
    return productsToCompare.map((p) => {
      const spec = p.specifications?.[key];
      if (spec !== undefined) return spec;
      switch (key) {
        case "price": return formatPrice(convertPrice(p.price, currency), currency);
        case "stock": return p.stock !== undefined ? `${p.stock} in stock` : "N/A";
        case "rating": return p.rating !== undefined ? `${p.rating}/5` : "N/A";
        case "reviews": return p.numReviews !== undefined ? `${p.numReviews} reviews` : "N/A";
        case "brand": return p.brand || "N/A";
        case "weight": return p.weight || "N/A";
        case "dimensions": return p.dimensions || "N/A";
        case "material": return p.material || "N/A";
        case "warranty": return p.warranty || "N/A";
        default: return "N/A";
      }
    });
  };

  return { products, removeProduct, clearAll, canAddMore, addToCart, currency, getComparisonSpec };
}
