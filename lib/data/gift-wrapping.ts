import type { GiftWrappingOption } from "@/types/gift-wrapping";

export const GIFT_WRAPPING_OPTIONS: GiftWrappingOption[] = [
  { id: "classic", name: "Classic Elegant", price: 4.99, description: "Premium gold paper with silk ribbon", color: "#D4AF37", pattern: "solid" },
  { id: "minimal", name: "Minimal White", price: 3.99, description: "Clean white paper with natural twine", color: "#F5F5F5", pattern: "solid" },
  { id: "floral", name: "Floral Garden", price: 5.99, description: "Beautiful floral pattern paper", color: "#FFB6C1", pattern: "floral" },
  { id: "celebration", name: "Celebration", price: 4.99, description: "Colorful confetti pattern", color: "#FF6B6B", pattern: "confetti" },
  { id: "luxury", name: "Luxury Velvet", price: 9.99, description: "Premium velvet box with gold accents", color: "#2C3E50", pattern: "velvet" },
  { id: "eco", name: "Eco Friendly", price: 3.49, description: "Recycled kraft paper", color: "#C4A77D", pattern: "kraft" },
];
