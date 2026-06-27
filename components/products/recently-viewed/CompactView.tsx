"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { formatPrice, convertPrice } from "@/lib/localization";
import { useLocalization } from "@/features/common/hooks/LocalizationContext";
import type { RecentlyViewedProduct } from "@/features/common/hooks/RecentlyViewedContext";

interface CompactViewProps {
  products: RecentlyViewedProduct[];
  onRemove: (id: string) => void;
}

export function CompactView({ products, onRemove }: CompactViewProps) {
  const { currency } = useLocalization();

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.slug || product.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
            <Image src={getSafeImageSrc(product.image)} alt={product.name} fill className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(); }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{product.name}</p>
            <p className="text-xs text-muted-foreground">{formatPrice(convertPrice(product.price, currency), currency)}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.preventDefault(); onRemove(product.id); }} aria-label={`Remove ${product.name}`}>
            <X className="w-4 h-4" />
          </Button>
        </Link>
      ))}
    </div>
  );
}
