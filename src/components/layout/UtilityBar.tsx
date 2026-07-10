"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, RotateCcw, X, ChevronRight } from "lucide-react";
import { LanguageCurrencySwitcher } from "./LanguageCurrencySwitcher";

const promos = [
  { id: 1, text: "Free Express Shipping on orders over $50", link: "/products", cta: "Shop Now" },
  { id: 2, text: "Up to 50% off selected premium items this week", link: "/products?sale=true", cta: "View Deals" },
  { id: 3, text: "New Arrivals: Summer Collection 2025 just dropped", link: "/products?sort=newest", cta: "Explore" },
  { id: 4, text: "Get $10 off your first order — limited time only", link: "/register", cta: "Sign Up" },
];

export function UtilityBar() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !visible) return;
    const id = setInterval(() => setPromoIndex((i) => (i + 1) % promos.length), 6000);
    return () => clearInterval(id);
  }, [mounted, visible]);

  const dismiss = useCallback(() => setVisible(false), []);

  if (!mounted || !visible) return null;

  const promo = promos[promoIndex];

  return (
    <div className="w-full bg-muted/30 border-b border-border/30 hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        {/* Left — Trust signals */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Truck className="w-3.5 h-3.5" />
            Free Shipping $50+
          </span>
          <span className="w-px h-3 bg-border/60" />
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <RotateCcw className="w-3.5 h-3.5" />
            Free 30-Day Returns
          </span>
        </div>

        {/* Center — Rotating promo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5"
            >
              <span className="text-[11px] font-medium text-muted-foreground">{promo.text}</span>
              <Link
                href={promo.link}
                className="text-[11px] font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-0.5"
              >
                {promo.cta}
                <ChevronRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — Support + Lang/Currency */}
        <div className="flex items-center gap-4">
          <Link href="/faq" className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            Help Center
          </Link>
          <Link href="/contact" className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <span className="w-px h-3 bg-border/60" />
          <LanguageCurrencySwitcher />
          <button
            onClick={dismiss}
            className="p-0.5 rounded hover:bg-muted transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3 text-muted-foreground/50 hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
