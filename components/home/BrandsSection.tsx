"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "Apple", short: "apple", color: "#a8b3cf" },
  { name: "Samsung", short: "samsung", color: "#a8b3cf" },
  { name: "Sony", short: "sony", color: "#a8b3cf" },
  { name: "Nike", short: "nike", color: "#a8b3cf" },
  { name: "Adidas", short: "adidas", color: "#a8b3cf" },
  { name: "LG", short: "lg", color: "#a8b3cf" },
  { name: "Dell", short: "dell", color: "#a8b3cf" },
  { name: "HP", short: "hp", color: "#a8b3cf" },
  { name: "Bose", short: "bose", color: "#a8b3cf" },
  { name: "Canon", short: "canon", color: "#a8b3cf" },
  { name: "Lenovo", short: "lenovo", color: "#a8b3cf" },
  { name: "Asus", short: "asus", color: "#a8b3cf" },
];

// Duplicate for seamless loop
const doubled = [...brands, ...brands];

export function BrandsSection() {
  return (
    <section
      className="py-16 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050508 0%, #08060e 100%)",
        borderTop: "1px solid rgba(139, 92, 246, 0.1)",
        borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
      }}
    >
      <div className="container mx-auto px-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p
            className="text-xs font-black uppercase tracking-[0.35em] mb-1"
            style={{ color: "rgba(167, 139, 250, 0.6)" }}
          >
            Trusted By
          </p>
          <h3 className="text-2xl font-black text-white">
            World&apos;s Leading{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8, #a78bfa, #e879f9)" }}
            >
              Brands
            </span>
          </h3>
        </motion.div>
      </div>

      {/* Marquee with edge fade */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #050508 0%, transparent 100%)" }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #050508 0%, transparent 100%)" }}
        />

        <div className="overflow-hidden">
          <div className="flex animate-marquee gap-12 items-center" style={{ width: "max-content" }}>
            {doubled.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl shrink-0 group cursor-pointer transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)" }}
                />
                <span
                  className="text-base font-black uppercase tracking-widest transition-colors duration-300 group-hover:text-violet-400"
                  style={{ color: "rgba(148, 163, 184, 0.6)" }}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Second row, reversed direction */}
        <div className="overflow-hidden mt-4">
          <div
            className="flex gap-12 items-center"
            style={{ width: "max-content", animation: "marquee 35s linear infinite reverse" }}
          >
            {doubled.map((brand, index) => (
              <div
                key={`r-${brand.name}-${index}`}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl shrink-0 group cursor-pointer transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "linear-gradient(135deg, #e879f9, #a78bfa)" }}
                />
                <span
                  className="text-sm font-black uppercase tracking-widest transition-colors duration-300 group-hover:text-fuchsia-400"
                  style={{ color: "rgba(148, 163, 184, 0.4)" }}
                >
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
