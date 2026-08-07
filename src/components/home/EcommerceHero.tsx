"use client";

import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function EcommerceHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Subtle gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.02] dark:from-primary/[0.05] dark:via-transparent dark:to-primary/[0.03]" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <HeroContent />
          <HeroVisual />
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-muted-foreground/40 text-[10px] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
