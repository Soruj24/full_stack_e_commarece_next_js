"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { cn, getFallbackImage, getSafeImageSrc } from "@/lib/utils";

interface Props {
  images: string[];
  productName: string;
  activeIndex: number;
  onSelect: (idx: number) => void;
  onError: () => void;
  categorySlug?: string;
}

export function ProductImageGallery({ images, productName, activeIndex, onSelect, onError, categorySlug }: Props) {
  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border/50 shadow-2xl shadow-primary/5 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={getSafeImageSrc(images?.[activeIndex], categorySlug)}
              alt={productName}
              fill priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getFallbackImage(categorySlug);
                onError();
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute top-6 right-6 z-10">
          <Button size="icon" variant="secondary" className="rounded-2xl bg-white/80 backdrop-blur-md shadow-lg border-transparent" aria-label="Share product">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(images || []).map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
              activeIndex === idx ? "border-primary shadow-xl shadow-primary/10 scale-95" : "border-transparent hover:border-primary/30",
            )}
          >
            <Image
              src={getSafeImageSrc(img, categorySlug)}
              alt={`${productName} ${idx}`}
              fill
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(categorySlug); }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
