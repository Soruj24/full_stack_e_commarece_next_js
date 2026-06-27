"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSaveForLater } from "@/features/cart/context/SaveForLaterContext";

interface SaveForLaterButtonProps {
  product: { _id: string; name: string; price: number; image?: string; stock?: number };
  variant?: "icon" | "button" | "text";
  className?: string;
  onSave?: () => void;
}

export function SaveForLaterButton({ product, variant = "icon", className, onSave }: SaveForLaterButtonProps) {
  const { addToSaveForLater, removeFromSaveForLater, isSaved } = useSaveForLater();
  const saved = isSaved(product._id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeFromSaveForLater(product._id);
    } else {
      addToSaveForLater({ id: product._id, name: product.name, price: product.price, image: product.image || "", quantity: 1, stock: product.stock || 10 });
      onSave?.();
    }
  };

  if (variant === "text") {
    return (
      <button onClick={handleToggle} className={cn("flex items-center gap-2 text-sm transition-colors", saved ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground", className)}>
        <Heart className={cn("w-4 h-4", saved && "fill-current")} />{saved ? "Saved" : "Save for Later"}
      </button>
    );
  }

  if (variant === "button") {
    return (
      <Button variant={saved ? "secondary" : "outline"} onClick={handleToggle}
        className={cn("gap-2 rounded-xl", saved && "border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600", className)}>
        <Heart className={cn("w-4 h-4", saved && "fill-current")} />{saved ? "Saved" : "Save for Later"}
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleToggle}
      className={cn("rounded-full transition-all", saved ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-600" : "hover:bg-red-50 hover:text-red-500", className)}
      aria-label={saved ? "Remove from saved" : "Save for later"}>
      <Heart className={cn("w-5 h-5", saved && "fill-current")} />
    </Button>
  );
}
