"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn, getFallbackImage, getSafeImageSrc } from "@/lib/utils";
import { IProduct } from "@/types";

interface QuickViewGalleryProps {
  product: IProduct;
  activeImage: number;
  setActiveImage: (index: number) => void;
}

export function QuickViewGallery({
  product,
  activeImage,
  setActiveImage,
}: QuickViewGalleryProps) {
  const categorySlug =
    typeof product.category === "object" &&
    product.category !== null &&
    "slug" in product.category
      ? (product.category as { slug?: string }).slug
      : undefined;

  return (
    <div className="relative bg-muted/20 p-6 flex flex-col gap-4">
      <div className="relative aspect-square rounded-[32px] overflow-hidden border border-border/40 bg-card">
        <motion.div
          key={activeImage}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          <Image
            src={getSafeImageSrc(product.images?.[activeImage], categorySlug)}
            alt={product.name || "Product Image"}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Badge */}
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
            Protocol {product.brand || "Standard"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(product.images || []).map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={cn(
              "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500",
              activeImage === idx
                ? "border-primary scale-95 shadow-lg shadow-primary/10"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Image
              src={getSafeImageSrc(img, categorySlug)}
              alt={`${product.name || "Product"} ${idx}`}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackImage(product.category?.slug);
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
