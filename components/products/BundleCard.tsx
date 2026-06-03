"use client";

import { Bundle } from "@/context/BundleContext";
import { useBundleCard } from "@/hooks/use-bundle-card";
import { BundleCardCompact } from "./bundle-card/BundleCardCompact";
import { BundleCardFeatured } from "./bundle-card/BundleCardFeatured";
import { BundleCardDefault } from "./bundle-card/BundleCardDefault";

interface BundleCardProps {
  bundle: Bundle;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function BundleCard({
  bundle,
  variant = "default",
  className,
}: BundleCardProps) {
  const {
    inCart,
    isLowStock,
    isOutOfStock,
    isAdding,
    justAdded,
    handleAddToCart,
  } = useBundleCard(bundle);

  if (variant === "compact") {
    return (
      <BundleCardCompact
        bundle={bundle}
        className={className}
        isAdding={isAdding}
        justAdded={justAdded}
        isOutOfStock={isOutOfStock}
        onAddToCart={handleAddToCart}
      />
    );
  }

  if (variant === "featured") {
    return (
      <BundleCardFeatured
        bundle={bundle}
        className={className}
        isAdding={isAdding}
        justAdded={justAdded}
        isLowStock={isLowStock}
        isOutOfStock={isOutOfStock}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <BundleCardDefault
      bundle={bundle}
      className={className}
      inCart={inCart}
      isAdding={isAdding}
      justAdded={justAdded}
      isLowStock={isLowStock}
      isOutOfStock={isOutOfStock}
      onAddToCart={handleAddToCart}
    />
  );
}

export { BundleGrid } from "./bundle-card/BundleGrid";
