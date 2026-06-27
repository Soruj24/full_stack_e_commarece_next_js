import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import type { GiftWrappingOption, GiftMessage } from "@/features/cart/types/gift-wrapping";

interface GiftMessageCardProps {
  giftMessage: GiftMessage;
  wrappingStyle: GiftWrappingOption;
}

export function GiftMessageCard({ giftMessage, wrappingStyle }: GiftMessageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg"
    >
      <div className="h-24 flex items-center justify-center" style={{ backgroundColor: wrappingStyle.color }}>
        <Gift className="w-12 h-12 text-white/80" />
      </div>
      <div className="p-6 text-center">
        <p className="text-xs text-zinc-500 mb-2">To: {giftMessage.to}</p>
        {giftMessage.message && <p className="italic text-sm mb-2">&ldquo;{giftMessage.message}&rdquo;</p>}
        <p className="text-xs text-zinc-500">From: {giftMessage.from}</p>
      </div>
    </motion.div>
  );
}
