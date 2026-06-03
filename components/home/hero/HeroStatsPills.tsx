"use client";

import { motion } from "framer-motion";
import { TrendingUp, Star, Heart } from "lucide-react";

export function HeroStatsPills() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-8 left-0 z-20 animate-float-delayed"
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(15, 10, 30, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(167, 139, 250, 0.2)" }}>
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-white text-sm font-black leading-none">50,000+</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Happy Customers</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute -bottom-2 right-8 z-20 animate-float"
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(15, 10, 30, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(234, 179, 8, 0.2)" }}>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <p className="text-white text-sm font-black leading-none">4.9 / 5.0</p>
            <p className="text-slate-400 text-[11px] mt-0.5">12,000+ Reviews</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute top-1/2 left-0 -translate-y-1/2 z-20"
      >
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold">98% Love This</span>
        </div>
      </motion.div>
    </>
  );
}
