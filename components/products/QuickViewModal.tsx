"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Eye, Star, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { IProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getSafeImageSrc } from "@/lib/utils";

interface QuickViewModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const hasDiscount = (product.discountPrice ?? 0) > 0 && (product.discountPrice ?? 0) < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;
  const imageSrc = getSafeImageSrc(product.images?.[0], product.category?.slug);

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: currentPrice,
      image: imageSrc,
      quantity,
      stock: product.stock,
    });
    onClose();
  };

  const isWishlisted = isInWishlist(product._id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] bg-card rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh]">
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-muted/30">
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full">
                      {product.category?.name || "Uncategorized"}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">(128 reviews)</span>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold">{product.name}</h2>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-primary">
                      ${currentPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xl text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {product.description?.substring(0, 200)}...
                  </p>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      (product.stock ?? 0) > 10 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : (product.stock ?? 0) > 0
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {(product.stock ?? 0) > 10 
                        ? "In Stock"
                        : (product.stock ?? 0) > 0
                        ? `Only ${product.stock} left`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <span className="text-sm font-medium">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock ?? 1, quantity + 1))}
                        className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      size="lg"
                      className="flex-1 h-14 rounded-xl font-bold shadow-lg shadow-primary/20"
                      onClick={handleAddToCart}
                      disabled={(product.stock ?? 0) === 0}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 w-14 rounded-xl"
                      onClick={() => toggleWishlist(product._id)}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>

                  <Button variant="ghost" size="lg" className="w-full h-12 rounded-xl mt-2" asChild>
                    <Link href={`/products/${product._id}`} onClick={onClose}>
                      <Eye className="w-5 h-5 mr-2" />
                      View Full Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
