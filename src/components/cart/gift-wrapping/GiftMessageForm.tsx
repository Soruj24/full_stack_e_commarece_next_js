import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { GiftMessage } from "@/modules/cart/types/gift-wrapping";

interface GiftMessageFormProps {
  show: boolean;
  onToggle: () => void;
  giftMessage?: GiftMessage;
  onMessageChange: (message: GiftMessage) => void;
}

export function GiftMessageForm({ show, onToggle, giftMessage, onMessageChange }: GiftMessageFormProps) {
  return (
    <div>
      <button onClick={onToggle} className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        <MessageSquare className="w-4 h-4" />
        Add Gift Message
        <span className={cn("ml-auto transition-transform", show && "rotate-180")}>▼</span>
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-zinc-500 mb-1 block">To</label>
                <input
                  type="text" placeholder="Recipient name"
                  value={giftMessage?.to || ""}
                  onChange={(e) => onMessageChange({ ...giftMessage!, to: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-zinc-500 mb-1 block">From</label>
                <input
                  type="text" placeholder="Your name"
                  value={giftMessage?.from || ""}
                  onChange={(e) => onMessageChange({ ...giftMessage!, from: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-medium text-zinc-500 mb-1 block">Message (optional)</label>
              <Textarea
                placeholder="Write your gift message here..."
                value={giftMessage?.message || ""}
                onChange={(e) => onMessageChange({ ...giftMessage!, message: e.target.value })}
                maxLength={200}
                className="min-h-[80px] rounded-xl resize-none"
              />
              <p className="text-[10px] text-zinc-400 mt-1 text-right">{(giftMessage?.message || "").length}/200</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
