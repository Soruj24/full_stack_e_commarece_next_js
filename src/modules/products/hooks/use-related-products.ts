import { useState, useEffect, useRef } from "react";
import { useCart } from "@/modules/cart/context/CartContext";
import { useWishlist } from "@/modules/wishlist/hooks/WishlistContext";
import { toast } from "sonner";
import type { IProduct } from "@/shared/types";

export function useRelatedProducts(productId?: string, category?: string, maxItems = 8) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        let url = `/api/products/recommendations?limit=${maxItems}`;
        if (productId) url += `&productId=${productId}`;
        if (category) url += `&category=${category}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch related products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [productId, category, maxItems]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
    }
  };

  const handleQuickAddToCart = (product: IProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id, name: product.name, price: product.discountPrice || product.price,
      image: product.images?.[0] || "/placeholder.png", quantity: 1, stock: product.stock,
    });
  };

  const handleToggleWishlist = async (product: IProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  return { products, loading, isHovered, setIsHovered, scrollContainerRef, scroll, handleQuickAddToCart, handleToggleWishlist, isInWishlist };
}
