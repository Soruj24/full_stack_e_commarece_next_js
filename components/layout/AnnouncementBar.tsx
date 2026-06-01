"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Truck, Percent, Sparkles, Star, Zap } from "lucide-react";
import Link from "next/link";

const announcements = [
  {
    id: 1,
    icon: Truck,
    emoji: "🚚",
    text: "Free Express Shipping on orders over $50",
    link: "/products",
    linkText: "Shop Now",
    gradient: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600",
  },
  {
    id: 2,
    icon: Percent,
    emoji: "🔥",
    text: "Up to 50% off on selected premium items",
    link: "/products?sale=true",
    linkText: "View Deals",
    gradient: "bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600",
  },
  {
    id: 3,
    icon: Gift,
    emoji: "🎁",
    text: "Get a $10 coupon on your first order — Limited time!",
    link: "/register",
    linkText: "Sign Up",
    gradient: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600",
  },
  {
    id: 4,
    icon: Star,
    emoji: "⭐",
    text: "New Arrivals: Summer Collection 2025 is here",
    link: "/products?sort=newest",
    linkText: "Explore",
    gradient: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600",
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted || !isVisible) return null;

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div className={`${current.gradient} relative text-white overflow-hidden`}>
      {/* Animated shimmer */}
      <div className="absolute inset-0 shimmer pointer-events-none" />

      {/* Sparkle decorations */}
      <Sparkles
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
        aria-hidden="true"
      />
      <Sparkles
        className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-11 flex items-center justify-center px-10"
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="text-base">{current.emoji}</span>
            <span className="text-white/95">{current.text}</span>
            <span className="hidden sm:inline-block w-px h-4 bg-white/30" />
            <Link
              href={current.link}
              className="hidden sm:inline-flex items-center gap-1 font-bold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white transition-all"
            >
              {current.linkText}
              <Zap className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-5 bg-white" : "w-1.5 bg-white/40"
            }`}
            aria-label={`Announcement ${index + 1}`}
          />
        ))}
      </div>

      {/* Close */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
