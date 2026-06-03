import { motion } from "framer-motion";
import { Percent } from "lucide-react";

interface BundleSavingsSummaryProps {
  original: number;
  discounted: number;
  savings: number;
}

export function BundleSavingsSummary({ original, discounted, savings }: BundleSavingsSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Bundle Subtotal</span>
        <span className="font-semibold">${original.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
          <Percent className="w-4 h-4" />
          Bundle Discount (15%)
        </span>
        <span className="font-bold text-green-600">-${savings.toFixed(2)}</span>
      </div>
      <div className="h-px bg-green-500/20 my-3" />
      <div className="flex items-center justify-between">
        <span className="font-bold">Bundle Total</span>
        <span className="text-xl font-black text-green-600">${discounted.toFixed(2)}</span>
      </div>
    </motion.div>
  );
}
