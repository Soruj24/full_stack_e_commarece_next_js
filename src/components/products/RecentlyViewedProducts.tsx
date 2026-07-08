"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import { useRecentlyViewedProducts } from "@/modules/common/hooks/use-recently-viewed-products";
import { CompactView } from "./recently-viewed/CompactView";
import { DefaultView } from "./recently-viewed/DefaultView";

interface RecentlyViewedProductsProps {
  title?: string;
  maxProducts?: number;
  showClearButton?: boolean;
  variant?: "default" | "compact" | "carousel";
  className?: string;
}

export function RecentlyViewedProducts({ title = "Recently Viewed", maxProducts = 6, showClearButton = false, variant = "default", className }: RecentlyViewedProductsProps) {
  const { displayedProducts, mounted, removeProduct, clearAll, handleQuickAddToCart } = useRecentlyViewedProducts(maxProducts);

  if (!mounted || displayedProducts.length === 0) return null;

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {title && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
        )}
        <CompactView products={displayedProducts} onRemove={removeProduct} />
      </div>
    );
  }

  return (
    <DefaultView
      title={title}
      products={displayedProducts}
      showClearButton={showClearButton}
      onRemove={removeProduct}
      onClearAll={clearAll}
      onQuickAdd={handleQuickAddToCart}
    />
  );
}

export { RecentlyViewedWidget } from "./recently-viewed/RecentlyViewedWidget";
