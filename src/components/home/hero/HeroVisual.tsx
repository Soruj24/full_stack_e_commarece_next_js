"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative hidden lg:flex items-center justify-center"
      style={{ minHeight: "520px" }}
    >
      {/* Subtle glow behind image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/[0.04] dark:bg-primary/[0.06] blur-3xl" />

      {/* Main image card */}
      <div className="relative z-10 rounded-2xl overflow-hidden border border-border/40 shadow-xl shadow-black/[0.04] dark:shadow-black/[0.2]" style={{ width: "340px", height: "440px" }}>
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=680&h=880&fit=crop"
          alt="Premium Store"
          fill
          className="object-cover"
          priority
          sizes="340px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500 text-white text-[11px] font-semibold mb-2">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            In Stock
          </div>
          <h3 className="text-lg font-semibold text-white">Premium Collection</h3>
          <p className="text-white/60 text-[13px]">Curated for you</p>
        </div>
      </div>

      {/* Floating stat card - top left */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute top-8 left-0 z-20"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg shadow-black/[0.04] dark:shadow-black/[0.15]">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <span className="text-primary text-[11px] font-bold">50K+</span>
          </div>
          <div>
            <p className="text-foreground text-[12px] font-semibold leading-none">Happy Customers</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">Worldwide</p>
          </div>
        </div>
      </motion.div>

      {/* Floating stat card - bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="absolute -bottom-2 right-4 z-20"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg shadow-black/[0.04] dark:shadow-black/[0.15]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <span className="text-amber-600 dark:text-amber-400 text-[11px] font-bold">4.9</span>
          </div>
          <div>
            <p className="text-foreground text-[12px] font-semibold leading-none">Rating</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">12,000+ reviews</p>
          </div>
        </div>
      </motion.div>

      {/* Floating badge - left middle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute top-1/2 left-0 -translate-y-1/2 z-20"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">98% Satisfaction</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
