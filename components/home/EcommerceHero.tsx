"use client";

import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function EcommerceHero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.18) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 80% 20%, rgba(99, 102, 241, 0.18) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 50% 100%, rgba(232, 121, 249, 0.12) 0%, transparent 60%), " +
          "linear-gradient(180deg, #050508 0%, #0a0514 60%, #080010 100%)",
      }}
    >
      {/* Animated mesh grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top edge glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.6) 40%, rgba(232,121,249,0.6) 60%, transparent 100%)",
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <HeroContent />
          <HeroVisual />
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-violet-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
