"use client";

import { useCompare, CompareProduct } from "@/context/CompareContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  GitCompare, 
  Plus, 
  Check, 
  X, 
  Trash2,
  ShoppingCart,
  Star,
  Package,
  BarChart3,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { formatPrice } from "@/lib/localization";
import { useLocalization } from "@/context/LocalizationContext";
import { convertPrice } from "@/lib/localization";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompareButtonProps {
  product: Omit<CompareProduct, "addedAt">;
  variant?: "default" | "icon" | "compact";
  className?: string;
  showLabel?: boolean;
}

export function CompareButton({
  product,
  variant = "default",
  className,
  showLabel = true,
}: CompareButtonProps) {
  const { addProduct, removeProduct, isInCompare, products, canAddMore } = useCompare();
  const inCompare = isInCompare(product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inCompare) {
      removeProduct(product._id);
    } else {
      addProduct(product);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "rounded-full transition-all",
          inCompare && "bg-primary text-primary-foreground hover:bg-primary/90",
          !inCompare && "hover:bg-muted",
          className
        )}
        aria-label={inCompare ? "Remove from compare" : "Add to compare"}
      >
        {inCompare ? <Check className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
      </Button>
    );
  }

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={cn(
          "gap-2 rounded-lg transition-all",
          inCompare && "bg-primary/10 text-primary",
          !inCompare && "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {inCompare ? (
          <>
            <Check className="w-4 h-4" />
            {showLabel && "Added"}
          </>
        ) : (
          <>
            <GitCompare className="w-4 h-4" />
            {showLabel && "Compare"}
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={inCompare ? "secondary" : "outline"}
      onClick={handleToggle}
      className={cn(
        "gap-2 rounded-xl transition-all",
        inCompare && "border-primary bg-primary/10 text-primary hover:bg-primary/20",
        !inCompare && "border-border hover:border-primary",
        className
      )}
      disabled={!inCompare && !canAddMore}
    >
      {inCompare ? (
        <>
          <Check className="w-4 h-4" />
          {showLabel && "In Compare"}
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          {showLabel && "Compare"}
        </>
      )}
    </Button>
  );
}

export function CompareFloatingButton() {
  const { products, maxProducts } = useCompare();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 z-40">
      <Sheet>
        <SheetTrigger asChild>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl shadow-2xl border p-4 cursor-pointer hover:shadow-3xl transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <GitCompare className="w-5 h-5 text-primary" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {products.length}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm">Compare</p>
                <p className="text-xs text-muted-foreground">
                  {products.length}/{maxProducts} products
                </p>
              </div>
            </div>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-[450px] p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              Compare Products
            </SheetTitle>
            <SheetDescription>
              Compare up to {maxProducts} products side by side
            </SheetDescription>
          </SheetHeader>
          <CompareContent />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CompareContent() {
  const { products, removeProduct, clearAll, canAddMore } = useCompare();
  const { addToCart } = useCart();
  const { currency } = useLocalization();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: CompareProduct) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
      stock: product.stock || 10,
    });
    setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  const getComparisonSpec = (key: string, products: CompareProduct[]) => {
    const values = products.map((p) => {
      const spec = p.specifications?.[key];
      if (spec !== undefined) return spec;
      switch (key) {
        case "price": return formatPrice(convertPrice(p.price, currency), currency);
        case "stock": return p.stock !== undefined ? `${p.stock} in stock` : "N/A";
        case "rating": return p.rating !== undefined ? `${p.rating}/5` : "N/A";
        case "reviews": return p.numReviews !== undefined ? `${p.numReviews} reviews` : "N/A";
        case "brand": return p.brand || "N/A";
        case "weight": return p.weight || "N/A";
        case "dimensions": return p.dimensions || "N/A";
        case "material": return p.material || "N/A";
        case "warranty": return p.warranty || "N/A";
        default: return "N/A";
      }
    });
    return values;
  };

  const allSpecs = [
    { key: "price", label: "Price" },
    { key: "brand", label: "Brand" },
    { key: "stock", label: "Availability" },
    { key: "rating", label: "Rating" },
    { key: "reviews", label: "Reviews" },
    { key: "weight", label: "Weight" },
    { key: "dimensions", label: "Dimensions" },
    { key: "material", label: "Material" },
    { key: "warranty", label: "Warranty" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Product Thumbnails */}
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

          {/* Quick Actions */}
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

          {/* Comparison Table Preview */}
          {products.length >= 2 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Quick Comparison</h4>
              <div className="space-y-2">
                {allSpecs.map((spec) => {
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

          {/* Add to Cart */}
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
                      variant={addedToCart[product._id] ? "secondary" : "default"}
                      onClick={() => handleAddToCart(product)}
                      className="ml-2"
                    >
                      {addedToCart[product._id] ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </>
                      )}
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
