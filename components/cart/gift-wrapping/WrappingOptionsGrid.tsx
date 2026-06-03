import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GIFT_WRAPPING_OPTIONS } from "@/lib/data/gift-wrapping";
import type { GiftWrappingOption } from "@/types/gift-wrapping";

interface WrappingOptionsGridProps {
  selectedOption?: GiftWrappingOption;
  onOptionChange: (option: GiftWrappingOption) => void;
}

export function WrappingOptionsGrid({ selectedOption, onOptionChange }: WrappingOptionsGridProps) {
  return (
    <div>
      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
        Choose Wrapping Style
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GIFT_WRAPPING_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionChange(option)}
            className={cn(
              "relative p-3 rounded-xl border-2 transition-all text-left",
              selectedOption?.id === option.id
                ? "border-primary bg-primary/5"
                : "border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/30"
            )}
          >
            <div className="w-full h-16 rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: option.color }}>
              {selectedOption?.id === option.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </div>
            <p className="font-semibold text-xs">{option.name}</p>
            <p className="text-[10px] text-zinc-500 line-clamp-1">{option.description}</p>
            <p className="text-xs font-bold text-primary mt-1">${option.price.toFixed(2)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
