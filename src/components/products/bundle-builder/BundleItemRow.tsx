import { motion } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";
import type { BundleItem } from "@/features/bundles/types/bundle";

interface BundleItemRowProps {
  item: BundleItem;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
}

export function BundleItemRow({ item, onUpdateQuantity, onRemove }: BundleItemRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-white/5 rounded-2xl"
    >
      <img src={item.product.images?.[0] || "/placeholder.png"} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm line-clamp-1">{item.product.name}</h4>
        <p className="text-xs text-zinc-500">${(item.product.discountPrice || item.product.price).toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary disabled:opacity-50">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
          className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/20 flex items-center justify-center hover:border-primary">
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <button onClick={() => onRemove(item.product._id)}
        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20 text-zinc-400 hover:text-red-500 transition-colors">
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
