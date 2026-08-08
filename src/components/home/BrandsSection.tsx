"use client";

import { useReducedMotion } from "framer-motion";

const brands = [
  { name: "Apple", initials: "A" },
  { name: "Samsung", initials: "SA" },
  { name: "Sony", initials: "SO" },
  { name: "Nike", initials: "NK" },
  { name: "Adidas", initials: "AD" },
  { name: "LG", initials: "LG" },
  { name: "Dell", initials: "D" },
  { name: "HP", initials: "HP" },
  { name: "Bose", initials: "B" },
  { name: "Canon", initials: "C" },
  { name: "Lenovo", initials: "L" },
  { name: "Asus", initials: "AS" },
];

const doubled = [...brands, ...brands];

export function BrandsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-14 border-y border-border/40 bg-surface/30 overflow-hidden" aria-label="Trusted brands">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.2em] mb-2">
            Trusted By
          </p>
          <h3 className="text-2xl font-semibold text-foreground">
            World&apos;s Leading Brands
          </h3>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div
          className="overflow-hidden"
          onMouseEnter={(e) => {
            if (!shouldReduceMotion) {
              const track = e.currentTarget.querySelector("[data-marquee]");
              if (track) (track as HTMLElement).style.animationPlayState = "paused";
            }
          }}
          onMouseLeave={(e) => {
            if (!shouldReduceMotion) {
              const track = e.currentTarget.querySelector("[data-marquee]");
              if (track) (track as HTMLElement).style.animationPlayState = "running";
            }
          }}
        >
          <div
            data-marquee
            className="flex gap-6 items-center"
            style={{
              width: "max-content",
              animation: shouldReduceMotion ? "none" : "marquee 35s linear infinite",
            }}
          >
            {doubled.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex items-center gap-3 px-6 py-3 rounded-xl shrink-0 border border-border/30 bg-surface/50 hover:border-border/60 hover:bg-surface transition-all duration-200 cursor-default group"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand.initials}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="overflow-hidden mt-3"
          onMouseEnter={(e) => {
            if (!shouldReduceMotion) {
              const track = e.currentTarget.querySelector("[data-marquee-rev]");
              if (track) (track as HTMLElement).style.animationPlayState = "paused";
            }
          }}
          onMouseLeave={(e) => {
            if (!shouldReduceMotion) {
              const track = e.currentTarget.querySelector("[data-marquee-rev]");
              if (track) (track as HTMLElement).style.animationPlayState = "running";
            }
          }}
        >
          <div
            data-marquee-rev
            className="flex gap-6 items-center"
            style={{
              width: "max-content",
              animation: shouldReduceMotion ? "none" : "marquee 35s linear infinite reverse",
            }}
          >
            {doubled.map((brand, index) => (
              <div
                key={`r-${brand.name}-${index}`}
                className="flex items-center gap-3 px-6 py-3 rounded-xl shrink-0 border border-border/30 bg-surface/50 hover:border-border/60 hover:bg-surface transition-all duration-200 cursor-default group"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[11px] font-bold text-muted-foreground/60 group-hover:text-foreground transition-colors">
                  {brand.initials}
                </div>
                <span className="text-sm font-medium text-muted-foreground/60 group-hover:text-foreground transition-colors">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
