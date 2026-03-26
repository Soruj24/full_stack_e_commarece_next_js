"use client";

import { HeroContent } from "./hero/HeroContent";
import { HeroVisual } from "./hero/HeroVisual";

export function EcommerceHero() {
  return (
    <section className="relative bg-background py-10 lg:py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] opacity-50" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <HeroContent />

          {/* Right Column: Hero Image/Visual */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
