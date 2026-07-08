"use client";

import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bundle } from "@/modules/bundles/context/BundleContext";
import { BundleCard } from "../BundleCard";

interface BundleGridProps {
  bundles: Bundle[];
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function BundleGrid({
  bundles,
  variant = "default",
  className,
}: BundleGridProps) {
  if (bundles.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">
          No bundles available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "featured"
          ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        className
      )}
    >
      {bundles.map((bundle) => (
        <BundleCard key={bundle._id} bundle={bundle} variant={variant} />
      ))}
    </div>
  );
}
