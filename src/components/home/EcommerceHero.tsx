"use client";

import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function EcommerceHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-background" aria-label="Welcome banner">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-10%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,transparent,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,transparent,transparent,rgba(255,255,255,0.02))]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 sm:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
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
