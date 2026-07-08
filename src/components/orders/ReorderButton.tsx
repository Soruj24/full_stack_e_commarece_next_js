"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart, CartItem } from "@/modules/cart/context/CartContext";

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock?: number;
}

interface ReorderButtonProps {
  orderId: string;
  items: OrderItem[];
  onReorderComplete?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function ReorderButton({
  orderId, items, onReorderComplete, variant = "outline", size = "sm",
}: ReorderButtonProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [unavailableItems, setUnavailableItems] = useState<string[]>([]);

  const handleReorder = async () => {
    setIsLoading(true);
    setUnavailableItems([]);
    setSuccess(false);

    try {
      let addedCount = 0;
      const unavailable: string[] = [];

      for (const item of items) {
        const stock = item.stock ?? 10;
        if (stock < item.quantity) { unavailable.push(item.name); continue; }
        addToCart({ id: item.product, name: item.name, price: item.price, image: item.image, quantity: item.quantity, stock });
        addedCount++;
      }

      setUnavailableItems(unavailable);

      if (addedCount > 0) {
        setSuccess(true);
        toast.success(`${addedCount} item(s) added to cart`);
        onReorderComplete?.();
        setTimeout(() => setSuccess(false), 3000);
      }

      if (unavailable.length > 0) {
        toast.warning(`${unavailable.length} item(s) couldn't be added due to availability`,
          { description: unavailable.join(", ") });
      }
    } catch {
      toast.error("Failed to reorder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Button variant="ghost" size={size} className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1" disabled>
        <Check className="w-4 h-4" />
        Added to Cart
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button variant={variant} size={size} onClick={handleReorder} disabled={isLoading || items.length === 0} className="gap-1">
        {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : <><RefreshCw className="w-4 h-4" /> Reorder</>}
      </Button>

      {unavailableItems.length > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <p className="font-semibold">Some items unavailable:</p>
            <p className="mt-1">{unavailableItems.join(", ")}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export { ReorderCard } from "./ReorderCard";
