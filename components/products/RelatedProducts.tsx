"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronLeft, 
  ChevronRight,
  Star,
  Heart,
  Eye,
  ShoppingCart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RelatedProductsProps {
  productId?: string;
  category?: string;
  currentProduct?: IProduct;
  maxItems?: number;
  title?: string;
}

export function RelatedProducts({
  productId,
  category,
  currentProduct,
  maxItems = 8,
  title = "You May Also Like",
}: RelatedProductsProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        let url = `/api/products/recommendations?limit=${maxItems}`;
        if (productId) url += `&productId=${productId}`;
        if (category) url += `&category=${category}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch related products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category, maxItems]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleQuickAddToCart = (product: IProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || "/placeholder.png",
      quantity: 1,
      stock: product.stock,
    });
  };

  const handleToggleWishlist = async (product: IProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-xs text-zinc-500">{products.length} products</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="rounded-full h-10 w-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="rounded-full h-10 w-10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Products Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => {
          const inWishlist = isInWishlist(product._id);
          const discount = product.discountPrice
            ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
            : 0;

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0 w-[260px]"
              onMouseEnter={() => setIsHovered(product._id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Link
                href={`/products/${product._id}`}
                className="block group"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                  <Image
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-500",
                      isHovered === product._id && "scale-110"
                    )}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isFeatured && (
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-lg">
                        Featured
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isHovered === product._id ? 1 : 0,
                      y: isHovered === product._id ? 0 : 10,
                    }}
                    className="absolute top-3 right-3 flex flex-col gap-2"
                  >
                    <button
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                        inWishlist
                          ? "bg-red-500 text-white"
                          : "bg-white/90 text-zinc-600 hover:bg-white hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white/90 text-zinc-600 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </motion.div>

                  {/* Quick Add Button */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isHovered === product._id ? 1 : 0,
                      y: isHovered === product._id ? 0 : 20,
                    }}
                    className="absolute bottom-3 left-3 right-3"
                  >
                    <Button
                      onClick={(e) => handleQuickAddToCart(product, e)}
                      size="sm"
                      className="w-full h-10 bg-white/95 hover:bg-white text-zinc-900 rounded-xl shadow-lg font-semibold"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Quick Add
                    </Button>
                  </motion.div>

                  {/* Out of Stock Overlay */}
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white text-sm font-bold rounded-xl">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    {product.brand || product.category?.name}
                  </p>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-zinc-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-zinc-500">
                        ({product.numReviews || 0})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      ${(product.discountPrice || product.price).toFixed(2)}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
