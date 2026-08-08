"use client";

import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function EcommerceHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background" aria-label="Welcome banner">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-primary)/0.06,transparent)]" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <HeroContent />
          <HeroVisual />
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-muted-foreground/30 text-[10px] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
