"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Truck, Percent, Gift, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const announcements = [
  {
    id: 1,
    icon: Truck,
    text: "Free Express Shipping on orders over $50",
    link: "/products",
    linkText: "Shop Now",
  },
  {
    id: 2,
    icon: Percent,
    text: "Up to 50% off on selected premium items",
    link: "/products?sale=true",
    linkText: "View Deals",
  },
  {
    id: 3,
    icon: Gift,
    text: "Get a $10 coupon on your first order",
    link: "/register",
    linkText: "Sign Up",
  },
  {
    id: 4,
    icon: Sparkles,
    text: "New Arrivals: Summer Collection 2025 is here",
    link: "/products?sort=newest",
    linkText: "Explore",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMounted, isVisible]);

  const dismiss = useCallback(() => setIsVisible(false), []);

  if (!isMounted || !isVisible) return null;

  const current = announcements[currentIndex];

  return (
    <div className="w-full bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-[shimmer_3s_infinite]" />
      </div>

      <div className="h-9 flex items-center justify-center px-12 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center gap-2 text-sm"
          >
            <current.icon className="w-3.5 h-3.5 opacity-80" />
            <span className="text-primary-foreground/90 text-[12px] font-medium">{current.text}</span>
            <span className="text-primary-foreground/30 mx-1">|</span>
            <Link
              href={current.link}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-foreground underline decoration-primary-foreground/30 underline-offset-2 hover:decoration-primary-foreground/70 transition-colors"
            >
              {current.linkText}
              <Zap className="w-3 h-3" />
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-4 bg-primary-foreground"
                  : "w-1.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
              aria-label={`Announcement ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-foreground/10 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
