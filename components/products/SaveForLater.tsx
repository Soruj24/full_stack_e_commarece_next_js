"use client";

import { useSaveForLater, SavedItem } from "@/context/SaveForLaterContext";
import { useCart } from "@/context/CartContext";
import { useLocalization } from "@/context/LocalizationContext";
import { formatPrice, convertPrice } from "@/lib/localization";
import { cn, getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Clock,
  Check,
  X,
  Package,
} from "lucide-react";

interface SaveForLaterButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    stock?: number;
  };
  variant?: "icon" | "button" | "text";
  className?: string;
  onSave?: () => void;
}

export function SaveForLaterButton({
  product,
  variant = "icon",
  className,
  onSave,
}: SaveForLaterButtonProps) {
  const { addToSaveForLater, removeFromSaveForLater, isSaved } = useSaveForLater();
  const { addToCart } = useCart();
  
  const saved = isSaved(product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      removeFromSaveForLater(product._id);
    } else {
      addToSaveForLater({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        quantity: 1,
        stock: product.stock || 10,
      });
      onSave?.();
    }
  };

  if (variant === "text") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 text-sm transition-colors",
          saved 
            ? "text-red-500 hover:text-red-600" 
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <Heart className={cn("w-4 h-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save for Later"}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        variant={saved ? "secondary" : "outline"}
        onClick={handleToggle}
        className={cn(
          "gap-2 rounded-xl",
          saved && "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600",
          className
        )}
      >
        <Heart className={cn("w-4 h-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save for Later"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "rounded-full transition-all",
        saved 
          ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600" 
          : "hover:bg-red-50 hover:text-red-500",
        className
      )}
      aria-label={saved ? "Remove from saved" : "Save for later"}
    >
      <Heart className={cn("w-5 h-5", saved && "fill-current")} />
    </Button>
  );
}

interface SaveForLaterListProps {
  maxItems?: number;
  showHeader?: boolean;
  variant?: "grid" | "list" | "compact";
  className?: string;
}

export function SaveForLaterList({
  maxItems,
  showHeader = true,
  variant = "list",
  className,
}: SaveForLaterListProps) {
  const { savedItems, moveToCart, removeFromSaveForLater, clearAll, getSavedCount, moveAllToCart } = useSaveForLater();
  const { addToCart } = useCart();
  const { currency } = useLocalization();

  const displayItems = maxItems ? savedItems.slice(0, maxItems) : savedItems;

  if (savedItems.length === 0) {
    return null;
  }

  const handleMoveToCart = (item: SavedItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      stock: item.stock,
    });
    moveToCart(item.id);
  };

  const priceChanged = (item: SavedItem) => {
    return item.priceWhenSaved && item.price !== item.priceWhenSaved;
  };

  const priceDifference = (item: SavedItem) => {
    if (!priceChanged(item)) return 0;
    return item.price - (item.priceWhenSaved || 0);
  };

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Saved ({getSavedCount()})</span>
            </div>
            <Link href="/saved" className="text-xs text-primary hover:underline">
              View All
            </Link>
          </div>
        )}
        <div className="space-y-2">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                  src={getSafeImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage();
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(convertPrice(item.price, currency), currency)}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMoveToCart(item)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={cn("space-y-6", className)}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold">Saved for Later</h3>
                <p className="text-sm text-muted-foreground">{getSavedCount()} items</p>
              </div>
            </div>
            {savedItems.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
                Clear All
              </Button>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border overflow-hidden group"
            >
              <div className="relative aspect-square bg-muted">
                <Image
                  src={getSafeImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage();
                  }}
                />
                <button
                  onClick={() => removeFromSaveForLater(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
                {priceChanged(item) && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {priceDifference(item) > 0 ? "+" : ""}{formatPrice(convertPrice(priceDifference(item), currency), currency)}
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-primary">
                    {formatPrice(convertPrice(item.price, currency), currency)}
                  </p>
                  {item.stock === 0 && (
                    <span className="text-xs text-red-500">Out of stock</span>
                  )}
                </div>
                <Button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock === 0}
                  className="w-full gap-2"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Move to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold">Saved for Later</h3>
              <p className="text-sm text-muted-foreground">{getSavedCount()} items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={moveAllToCart}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Move All to Cart
            </Button>
            {savedItems.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="space-y-3">
        <AnimatePresence>
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 p-4 bg-card rounded-2xl border group hover:border-primary/30 transition-colors"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                <Image
                  src={getSafeImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getFallbackImage();
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`}>
                  <h4 className="font-medium hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-bold text-primary">
                    {formatPrice(convertPrice(item.price, currency), currency)}
                  </p>
                  {priceChanged(item) && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(convertPrice(item.priceWhenSaved!, currency), currency)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {item.stock > 0 ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> In Stock
                    </span>
                  ) : (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <X className="w-3 h-3" /> Out of Stock
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Saved {new Date(item.addedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock === 0}
                  size="sm"
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Move to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromSaveForLater(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SaveForLaterWidget() {
  const { getSavedCount } = useSaveForLater();
  const count = getSavedCount();

  if (count === 0) return null;

  return (
    <Link href="/saved">
      <div className="fixed bottom-20 right-4 z-40">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-2xl shadow-2xl border p-4 cursor-pointer hover:shadow-3xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm">Saved Items</p>
              <p className="text-xs text-muted-foreground">{count} item{count !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
