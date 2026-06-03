import { motion } from "framer-motion";
import { Package } from "lucide-react";

interface BundleBuilderHeaderProps {
  itemsCount: number;
  minItems: number;
  maxItems: number;
}

export function BundleBuilderHeader({ itemsCount, minItems, maxItems }: BundleBuilderHeaderProps) {
  return (
    <div className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-zinc-200 dark:border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
          <Package className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Build Your Bundle</h2>
          <p className="text-sm text-zinc-500">Add {minItems}-{maxItems} items and save 15%</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs font-medium mb-2">
          <span>Bundle Progress</span>
          <span className={itemsCount >= minItems ? "text-green-600" : ""}>
            {itemsCount}/{minItems} min required
          </span>
        </div>
        <div className="h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((itemsCount / maxItems) * 100, 100)}%` }}
            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
