"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FEATURED_PRODUCTS } from "@/lib/data/mega-menu";

interface MegaMenuFeaturedProductsProps {
  onClose: () => void;
}

export function MegaMenuFeaturedProducts({ onClose }: MegaMenuFeaturedProductsProps) {
  return (
    <div className="col-span-5">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-4 h-4 text-yellow-500" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-600 dark:text-yellow-500">
          Trending Now
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {FEATURED_PRODUCTS.map((product, idx) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href="/products"
              onClick={onClose}
              className="group block bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 rounded-full bg-primary/90 text-[9px] font-black uppercase text-primary-foreground">
                    {product.badge}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] font-bold line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-primary">
                    ${product.price}
                  </span>
                  <span className="text-[10px] text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
