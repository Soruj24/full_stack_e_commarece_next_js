import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface GiftWrappingToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function GiftWrappingToggle({ isEnabled, onToggle }: GiftWrappingToggleProps) {
  return (
    <div className="p-5 border-b border-zinc-100 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            isEnabled ? "bg-primary/10 text-primary" : "bg-zinc-100 dark:bg-white/10 text-zinc-400"
          )}>
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Gift Wrapping</h3>
            <p className="text-xs text-zinc-500">
              {isEnabled ? "Add a personal touch" : "Make it extra special"}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggle(!isEnabled)}
          className={cn("relative w-12 h-7 rounded-full transition-colors", isEnabled ? "bg-primary" : "bg-zinc-200 dark:bg-white/20")}
        >
          <motion.div
            animate={{ x: isEnabled ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
          />
        </button>
      </div>
    </div>
  );
}
