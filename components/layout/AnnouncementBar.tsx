"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Truck, Percent, Sparkles } from "lucide-react";
import Link from "next/link";

const announcements = [
  {
    id: 1,
    icon: Truck,
    text: "Free Shipping on orders over $50",
    link: "/products",
    linkText: "Shop Now",
  },
  {
    id: 2,
    icon: Percent,
    text: "Up to 50% off on selected items",
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
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-10 flex items-center justify-center"
        >
          <div className="flex items-center gap-3 text-sm font-medium">
            <Icon className="w-4 h-4" />
            <span>{current.text}</span>
            <Link
              href={current.link}
              className="underline underline-offset-2 hover:text-white/80 transition-colors"
            >
              {current.linkText}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
