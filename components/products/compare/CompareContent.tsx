"use client";

import { CompareProduct } from "@/context/CompareContext";
import { formatPrice, convertPrice } from "@/lib/localization";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2, BarChart3, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCompareContent, ALL_SPECS } from "@/hooks/use-compare-content";

export function CompareContent() {
  const { products, removeProduct, clearAll, canAddMore, addToCart, currency, getComparisonSpec } = useCompareContent();

  const handleAddToCart = (product: CompareProduct) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      stock: product.stock || 10,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product._id} className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={getSafeImageSrc(product.images?.[0])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getFallbackImage();
                    }}
                  />
                </div>
                <button
                  onClick={() => removeProduct(product._id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs font-medium mt-2 line-clamp-2">{product.name}</p>
              </div>
            ))}
            {canAddMore && (
              <Link
                href="/products"
                className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add More</span>
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link href="/compare">
                <BarChart3 className="w-4 h-4 mr-2" />
                Full Compare
              </Link>
            </Button>
          </div>

          {products.length >= 2 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Quick Comparison</h4>
              <div className="space-y-2">
                {ALL_SPECS.map((spec) => {
                  const values = getComparisonSpec(spec.key, products);
                  const allSame = values.every((v) => v === values[0]);
                  return (
                    <div key={spec.key} className="grid grid-cols-[100px_1fr] gap-2 text-sm">
                      <span className="text-muted-foreground font-medium">{spec.label}</span>
                      <div className="flex gap-4">
                        {values.map((val, i) => (
                          <span
                            key={i}
                            className={cn(
                              "flex-1 text-center",
                              !allSame && "font-medium text-foreground",
                              allSame && "text-muted-foreground"
                            )}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {products.length >= 1 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Quick Add to Cart</h4>
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-xs text-primary font-bold">
                        {formatPrice(convertPrice(product.price, currency), currency)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAddToCart(product)}
                      className="ml-2"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
