"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useSaveForLater } from "@/context/SaveForLaterContext";
import { getSafeImageSrc } from "@/lib/utils";

export function CartSaveForLater() {
  const { savedItems, moveToCart, removeFromSaveForLater } = useSaveForLater();
  const { addToCart } = useCart();

  if (savedItems.length === 0) return null;

  const handleMoveToCart = (item: typeof savedItems[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      stock: item.stock,
    });
    moveToCart(item.id);
  };

  return (
    <div className="pt-12 border-t border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Saved for Later</h3>
            <p className="text-sm text-muted-foreground">{savedItems.length} items</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {savedItems.slice(0, 3).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-card rounded-2xl border group hover:border-primary/30 transition-colors"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
              <Image
                src={getSafeImageSrc(item.image)}
                alt={item.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-product.svg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{item.name}</h4>
              <p className="text-sm font-bold text-primary">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handleMoveToCart(item)}
                className="gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Move
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
      </div>
      {savedItems.length > 3 && (
        <Link href="/saved" className="block mt-4">
          <Button variant="ghost" className="w-full gap-2">
            View All {savedItems.length} Saved Items
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}

import { ArrowRight } from "lucide-react";