"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart } from "lucide-react";
import { FloatingCardData } from "@/lib/data/hero-visual-data";

interface HeroFloatingCardProps {
  card: FloatingCardData;
}

export function HeroFloatingCard({ card }: HeroFloatingCardProps) {
  return (
    <motion.div
      className={`absolute z-20 ${card.animate}`}
      style={{ animationDelay: `${card.delay}s` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + card.delay * 0.3, duration: 0.5 }}
    >
      <div
        className="rounded-2xl p-3.5 w-52"
        style={{
          background: "rgba(15, 10, 30, 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
            <Image src={card.image} alt={card.name} width={48} height={48} className="object-cover w-full h-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold leading-tight truncate">{card.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-[10px] font-bold">{card.rating}</span>
              <span className="text-slate-400 text-[10px]">({card.reviews})</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-violet-400 text-sm font-black">{card.price}</span>
            <span className="text-slate-500 text-xs line-through ml-1.5">{card.originalPrice}</span>
          </div>
          <div className={`text-[10px] font-bold text-white px-2 py-1 rounded-lg bg-gradient-to-r ${card.badgeColor}`}>
            {card.badge}
          </div>
        </div>
        <button
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: "rgba(139, 92, 246, 0.25)", border: "1px solid rgba(139, 92, 246, 0.3)" }}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
