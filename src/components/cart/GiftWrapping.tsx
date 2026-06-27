"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { GiftWrappingToggle } from "./gift-wrapping/GiftWrappingToggle";
import { WrappingOptionsGrid } from "./gift-wrapping/WrappingOptionsGrid";
import { GiftMessageForm } from "./gift-wrapping/GiftMessageForm";
import { GiftSummaryBar } from "./gift-wrapping/GiftSummaryBar";
import type { GiftWrappingOption, GiftMessage } from "@/features/cart/types/gift-wrapping";

interface GiftWrappingProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  selectedOption?: GiftWrappingOption;
  onOptionChange: (option: GiftWrappingOption) => void;
  giftMessage?: GiftMessage;
  onMessageChange: (message: GiftMessage) => void;
}

export function GiftWrapping({ isEnabled, onToggle, selectedOption, onOptionChange, giftMessage, onMessageChange }: GiftWrappingProps) {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <GiftWrappingToggle isEnabled={isEnabled} onToggle={onToggle} />

      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-5">
              <WrappingOptionsGrid selectedOption={selectedOption} onOptionChange={onOptionChange} />
              <GiftMessageForm show={showMessage} onToggle={() => setShowMessage(!showMessage)} giftMessage={giftMessage} onMessageChange={onMessageChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEnabled && selectedOption && <GiftSummaryBar selectedOption={selectedOption} giftMessage={giftMessage} />}
    </div>
  );
}

export { GiftMessageCard } from "./gift-wrapping/GiftMessageCard";
export type { GiftWrappingOption, GiftMessage } from "@/features/cart/types/gift-wrapping";
