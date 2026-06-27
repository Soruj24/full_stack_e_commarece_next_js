"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { useRecentlyViewed } from "@/features/common/hooks/RecentlyViewedContext";

export function RecentlyViewedWidget() {
  const { products } = useRecentlyViewed();

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <div className="bg-card rounded-2xl shadow-2xl border p-4 max-w-xs animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Recently Viewed</span>
          <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">{products.length}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {products.slice(0, 5).map((product) => (
            <Link key={product.id} href={`/products/${product.slug || product.id}`} className="shrink-0 group">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted mb-1">
                <Image src={getSafeImageSrc(product.image)} alt={product.name} fill className="object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(); }} />
              </div>
            </Link>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
          <Link href="#recently-viewed">View All<ArrowRight className="w-4 h-4 ml-1" /></Link>
        </Button>
      </div>
    </div>
  );
}
