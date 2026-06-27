"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { testimonials } from "@/lib/data/testimonials-data";

export function TestimonialsSection() {
  const summary = [
    { label: "Average Rating", value: "4.9/5" },
    { label: "Total Reviews", value: "12,000+" },
    { label: "Satisfaction Rate", value: "98%" },
  ];

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #07050f 0%, #0a0514 50%, #07050f 100%)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.02) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(139, 92, 246, 0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              color: "#a78bfa",
            }}
          >
            <Star className="w-4 h-4 fill-current" />
            Customer Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            What Our{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)" }}
            >
              Customers Say
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what real customers say about their experience.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {summary.map((s) => (
              <div
                key={s.label}
                className="px-6 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-xl font-black text-violet-400">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}
