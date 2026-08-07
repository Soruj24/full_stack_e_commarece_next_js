"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, TrendingUp, Heart } from "lucide-react";

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative hidden lg:flex items-center justify-center"
      style={{ minHeight: "560px" }}
    >
      {/* Subtle glow behind image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/[0.04] blur-3xl" />

      {/* Main image card */}
      <div className="relative z-10 rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-black/[0.04] dark:shadow-black/[0.2]" style={{ width: "360px", height: "460px" }}>
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=720&h=920&fit=crop"
          alt="Premium Store"
          fill
          className="object-cover"
          priority
          sizes="360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[11px] font-semibold mb-3">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            In Stock
          </div>
          <h3 className="text-xl font-semibold text-white mb-1">Premium Collection</h3>
          <p className="text-white/50 text-[13px]">Curated for you</p>
        </div>
      </div>

      {/* Floating stat - top left */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute top-6 left-0 z-20"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg">
          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-foreground text-[13px] font-semibold leading-none">50K+</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">Happy Customers</p>
          </div>
        </div>
      </motion.div>

      {/* Floating stat - bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute bottom-8 right-0 z-20"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-foreground text-[13px] font-semibold leading-none">4.9 / 5.0</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">12,000+ reviews</p>
          </div>
        </div>
      </motion.div>

      {/* Floating badge - left middle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.4 }}
        className="absolute top-1/2 left-0 -translate-y-1/2 z-20"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">98% Love This</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
