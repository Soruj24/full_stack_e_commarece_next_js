"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Check, Palette, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface GiftWrappingOption {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  pattern?: string;
  image?: string;
}

const GIFT_WRAPPING_OPTIONS: GiftWrappingOption[] = [
  {
    id: "classic",
    name: "Classic Elegant",
    price: 4.99,
    description: "Premium gold paper with silk ribbon",
    color: "#D4AF37",
    pattern: "solid",
  },
  {
    id: "minimal",
    name: "Minimal White",
    price: 3.99,
    description: "Clean white paper with natural twine",
    color: "#F5F5F5",
    pattern: "solid",
  },
  {
    id: "floral",
    name: "Floral Garden",
    price: 5.99,
    description: "Beautiful floral pattern paper",
    color: "#FFB6C1",
    pattern: "floral",
  },
  {
    id: "celebration",
    name: "Celebration",
    price: 4.99,
    description: "Colorful confetti pattern",
    color: "#FF6B6B",
    pattern: "confetti",
  },
  {
    id: "luxury",
    name: "Luxury Velvet",
    price: 9.99,
    description: "Premium velvet box with gold accents",
    color: "#2C3E50",
    pattern: "velvet",
  },
  {
    id: "eco",
    name: "Eco Friendly",
    price: 3.49,
    description: "Recycled kraft paper",
    color: "#C4A77D",
    pattern: "kraft",
  },
];

interface GiftMessage {
  to: string;
  from: string;
  message: string;
}

interface GiftWrappingProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  selectedOption?: GiftWrappingOption;
  onOptionChange: (option: GiftWrappingOption) => void;
  giftMessage?: GiftMessage;
  onMessageChange: (message: GiftMessage) => void;
}

export function GiftWrapping({
  isEnabled,
  onToggle,
  selectedOption,
  onOptionChange,
  giftMessage,
  onMessageChange,
}: GiftWrappingProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
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
            className={cn(
              "relative w-12 h-7 rounded-full transition-colors",
              isEnabled ? "bg-primary" : "bg-zinc-200 dark:bg-white/20"
            )}
          >
            <motion.div
              animate={{ x: isEnabled ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            />
          </button>
        </div>
      </div>

      {/* Options */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-5">
              {/* Wrapping Options */}
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
                      {/* Color Preview */}
                      <div
                        className="w-full h-16 rounded-lg mb-2 flex items-center justify-center"
                        style={{ backgroundColor: option.color }}
                      >
                        {selectedOption?.id === option.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary" />
                          </motion.div>
                        )}
                      </div>
                      
                      <p className="font-semibold text-xs">{option.name}</p>
                      <p className="text-[10px] text-zinc-500 line-clamp-1">
                        {option.description}
                      </p>
                      <p className="text-xs font-bold text-primary mt-1">
                        ${option.price.toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gift Message */}
              <div>
                <button
                  onClick={() => setShowMessage(!showMessage)}
                  className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Gift Message
                  <span className={cn(
                    "ml-auto transition-transform",
                    showMessage && "rotate-180"
                  )}>
                    ▼
                  </span>
                </button>

                <AnimatePresence>
                  {showMessage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-medium text-zinc-500 mb-1 block">
                            To
                          </label>
                          <input
                            type="text"
                            placeholder="Recipient name"
                            value={giftMessage?.to || ""}
                            onChange={(e) => onMessageChange({
                              ...giftMessage!,
                              to: e.target.value,
                            })}
                            className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-zinc-500 mb-1 block">
                            From
                          </label>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={giftMessage?.from || ""}
                            onChange={(e) => onMessageChange({
                              ...giftMessage!,
                              from: e.target.value,
                            })}
                            className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-zinc-500 mb-1 block">
                          Message (optional)
                        </label>
                        <Textarea
                          placeholder="Write your gift message here..."
                          value={giftMessage?.message || ""}
                          onChange={(e) => onMessageChange({
                            ...giftMessage!,
                            message: e.target.value,
                          })}
                          maxLength={200}
                          className="min-h-[80px] rounded-xl resize-none"
                        />
                        <p className="text-[10px] text-zinc-400 mt-1 text-right">
                          {(giftMessage?.message || "").length}/200
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {isEnabled && selectedOption && (
        <div className="px-5 py-3 bg-primary/5 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: selectedOption.color }}
              />
              <span className="text-xs font-medium">
                {selectedOption.name}
                {giftMessage?.message && " + Message"}
              </span>
            </div>
            <span className="text-sm font-bold text-primary">
              +${selectedOption.price.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <div
        className="h-24 flex items-center justify-center"
        style={{ backgroundColor: wrappingStyle.color }}
      >
        <Gift className="w-12 h-12 text-white/80" />
      </div>
      <div className="p-6 text-center">
        <p className="text-xs text-zinc-500 mb-2">To: {giftMessage.to}</p>
        {giftMessage.message && (
          <p className="italic text-sm mb-2">&ldquo;{giftMessage.message}&rdquo;</p>
        )}
        <p className="text-xs text-zinc-500">From: {giftMessage.from}</p>
      </div>
    </motion.div>
  );
}
