"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Trash2, ShoppingCart, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { formatPrice, convertPrice } from "@/lib/localization";
import { useLocalization } from "@/context/LocalizationContext";
import { toast } from "sonner";
import type { RecentlyViewedProduct } from "@/context/RecentlyViewedContext";

interface DefaultViewProps {
  title: string;
  products: RecentlyViewedProduct[];
  showClearButton: boolean;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onQuickAdd: (product: RecentlyViewedProduct) => void;
}

export function DefaultView({ title, products, showClearButton, onRemove, onClearAll, onQuickAdd }: DefaultViewProps) {
  const { currency } = useLocalization();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl"><Clock className="w-5 h-5 text-primary" /></div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{products.length} product{products.length !== 1 ? "s" : ""} viewed</p>
          </div>
        </div>
        {showClearButton && products.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => {
            toast("Clear all recently viewed items?", {
              action: { label: "Clear All", onClick: () => onClearAll() },
              cancel: { label: "Cancel", onClick: () => {} },
            });
          }} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product, index) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Link href={`/products/${product.slug || product.id}`} className="group block cursor-pointer">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                <Image src={getSafeImageSrc(product.image)} alt={product.name} fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(); }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Button variant="secondary" size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => { e.preventDefault(); onQuickAdd(product); }} aria-label={`Add ${product.name} to cart`}>
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <button onClick={(e) => { e.preventDefault(); onRemove(product.id); }}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                  aria-label={`Remove ${product.name}`}>
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">{product.name}</h3>
                {product.category && <p className="text-xs text-muted-foreground mb-1">{product.category}</p>}
                <p className="font-bold text-primary">{formatPrice(convertPrice(product.price, currency), currency)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/products">View All Products<ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </div>
    </div>
  );
}
