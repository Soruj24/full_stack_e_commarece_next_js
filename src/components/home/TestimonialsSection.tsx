"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { testimonials } from "@/lib/data/testimonials-data";

export function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();
  const summary = [
    { label: "Average Rating", value: "4.9/5" },
    { label: "Total Reviews", value: "12,000+" },
    { label: "Satisfaction Rate", value: "98%" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-surface/40" aria-label="Customer reviews">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            <Star className="w-3.5 h-3.5 fill-primary/60" />
            Customer Reviews
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what real customers say.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {summary.map((s) => (
              <div
                key={s.label}
                className="px-5 py-3 rounded-xl bg-card border border-border/50"
              >
                <p className="text-lg font-semibold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
