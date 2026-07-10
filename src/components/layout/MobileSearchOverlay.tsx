"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ProductSearch } from "@/components/products/ProductSearch";

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => ref.current?.querySelector("input")?.focus(), 150);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[60] bg-background"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 h-14" ref={ref}>
              <div className="flex-1">
                <ProductSearch />
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors shrink-0" aria-label="Close search">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
