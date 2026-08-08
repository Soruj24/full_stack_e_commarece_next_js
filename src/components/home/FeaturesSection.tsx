"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Shield, Truck, BadgeCheck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "SSL encrypted checkout with 256-bit encryption. Your data is always protected.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express shipping available. Most orders delivered within 2-5 business days.",
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    icon: BadgeCheck,
    title: "Quality Guarantee",
    description: "Handpicked products with quality assurance. Only the best reaches our shelves.",
    color: "text-violet-500",
    bg: "bg-violet-500/5",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. Not satisfied? Get a full refund.",
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options including installment plans. Shop your way.",
    color: "text-rose-500",
    bg: "bg-rose-500/5",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "24/7 customer service by real humans. We're here to help anytime.",
    color: "text-blue-500",
    bg: "bg-blue-500/5",
  },
];

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 sm:py-28 bg-surface/40 border-y border-border/30" aria-label="Why choose us">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            The Shop Experience
          </h2>
          <p className="text-muted-foreground text-base mt-3 max-w-xl mx-auto">
            We are committed to providing the best shopping experience with these premium benefits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="group bg-card border border-border/50 rounded-xl p-6 hover:border-border/80 hover:shadow-sm transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{feature.title}</h3>
              <p className="text-muted-foreground text-[13px] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
