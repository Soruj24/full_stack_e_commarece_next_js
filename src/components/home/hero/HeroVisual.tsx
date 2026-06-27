"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { floatingCards } from "@/lib/data/hero-visual-data";
import { HeroFloatingCard } from "./HeroFloatingCard";
import { HeroStatsPills } from "./HeroStatsPills";

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative hidden lg:flex items-center justify-center"
      style={{ minHeight: "600px" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="relative z-10 rounded-[40px] overflow-hidden"
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.15)",
          width: "360px",
          height: "480px",
          transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=720&h=960&fit=crop"
          alt="Premium Store"
          fill
          className="object-cover"
          priority
          sizes="360px"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white mb-2"
            style={{ background: "rgba(16, 185, 129, 0.9)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Official Store
          </div>
          <h3 className="text-xl font-bold text-white">Premium Collection 2025</h3>
          <p className="text-white/70 text-sm">Free shipping on orders over $50</p>
        </div>
      </div>

      {floatingCards.map((card) => (
        <HeroFloatingCard key={card.id} card={card} />
      ))}

      <HeroStatsPills />
    </motion.div>
  );
}
