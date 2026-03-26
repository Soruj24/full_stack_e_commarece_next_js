"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Check, Loader2, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart, CartItem } from "@/context/CartContext";

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
  orderId,
  items,
  onReorderComplete,
  variant = "outline",
  size = "sm",
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
        
        if (stock < item.quantity) {
          unavailable.push(item.name);
          continue;
        }

        const cartItem: CartItem = {
          id: item.product,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          stock: stock,
        };

        addToCart(cartItem);
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
        toast.warning(
          `${unavailable.length} item(s) couldn't be added due to availability`,
          {
            description: unavailable.join(", "),
          }
        );
      }
    } catch {
      toast.error("Failed to reorder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Button
        variant="ghost"
        size={size}
        className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
        disabled
      >
        <Check className="w-4 h-4" />
        Added to Cart
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleReorder}
        disabled={isLoading || items.length === 0}
        className="gap-1"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Reorder
          </>
        )}
      </Button>

      {unavailableItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg flex items-start gap-2"
        >
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

interface ReorderCardProps {
  orderId: string;
  items: OrderItem[];
  onReorderComplete?: () => void;
}

export function ReorderCard({ orderId, items, onReorderComplete }: ReorderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">
              Order #{orderId.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-zinc-500">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
          {expanded ? "Hide items" : "Show items"}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-white/5 rounded-xl"
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-white/10">
              <ReorderButton
                orderId={orderId}
                items={items}
                onReorderComplete={onReorderComplete}
                variant="default"
                size="default"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!expanded && (
        <div className="p-4">
          <ReorderButton
            orderId={orderId}
            items={items}
            onReorderComplete={onReorderComplete}
            variant="default"
            size="default"
          />
        </div>
      )}
    </div>
  );
}
