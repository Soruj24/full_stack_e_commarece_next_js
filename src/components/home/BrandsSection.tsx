"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "Apple" },
  { name: "Samsung" },
  { name: "Sony" },
  { name: "Nike" },
  { name: "Adidas" },
  { name: "LG" },
  { name: "Dell" },
  { name: "HP" },
  { name: "Bose" },
  { name: "Canon" },
  { name: "Lenovo" },
  { name: "Asus" },
];

const doubled = [...brands, ...brands];

export function BrandsSection() {
  return (
    <section className="py-14 border-y border-border/40 bg-surface/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.2em] mb-2">
            Trusted By
          </p>
          <h3 className="text-2xl font-semibold text-foreground">
            World&apos;s Leading Brands
          </h3>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div className="overflow-hidden">
          <div className="flex animate-marquee gap-8 items-center" style={{ width: "max-content" }}>
            {doubled.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg shrink-0 border border-border/30 bg-surface/50 hover:border-border/60 hover:bg-surface transition-all duration-200 cursor-default"
              >
                <span className="text-sm font-medium text-muted-foreground tracking-wide">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden mt-3">
          <div
            className="flex gap-8 items-center"
            style={{ width: "max-content", animation: "marquee 35s linear infinite reverse" }}
          >
            {doubled.map((brand, index) => (
              <div
                key={`r-${brand.name}-${index}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg shrink-0 border border-border/30 bg-surface/50 hover:border-border/60 hover:bg-surface transition-all duration-200 cursor-default"
              >
                <span className="text-sm font-medium text-muted-foreground/60 tracking-wide">
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
