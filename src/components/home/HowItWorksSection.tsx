"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Package, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Products",
    description: "Explore our extensive catalog. Use filters to find exactly what you need.",
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    icon: ShoppingCart,
    number: "02",
    title: "Add to Cart",
    description: "Found something you love? Add it to your cart with a single click.",
    color: "text-violet-500",
    bg: "bg-violet-500/5",
  },
  {
    icon: Package,
    number: "03",
    title: "Fast Delivery",
    description: "We process orders within 24 hours with top carriers worldwide.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
  {
    icon: Heart,
    number: "04",
    title: "Enjoy & Review",
    description: "Love your purchase? Leave a review to help others.",
    color: "text-rose-500",
    bg: "bg-rose-500/5",
  },
];

export function HowItWorksSection() {
  return (
    <div className="py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
          Simple Process
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          How It Works
        </h2>
        <p className="text-muted-foreground text-base mt-3 max-w-xl mx-auto">
          Shopping with us is easy. Follow these simple steps.
        </p>
      </motion.div>

      <div className="relative">
        <div className="hidden lg:block absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-px bg-border/40" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-card border border-border/50 rounded-xl p-7 text-center hover:border-border/80 hover:shadow-sm transition-all duration-200 relative">
                <div className="absolute top-3 right-3 text-[11px] font-semibold text-muted-foreground/20">
                  {step.number}
                </div>

                <div className={`w-14 h-14 mx-auto rounded-xl ${step.bg} flex items-center justify-center mb-5`}>
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                </div>

                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-[13px] leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
