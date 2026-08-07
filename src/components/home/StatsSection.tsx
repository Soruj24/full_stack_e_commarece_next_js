"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, ShoppingBag, Star, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Happy Customers",
    description: "And counting every day",
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    icon: ShoppingBag,
    value: 100000,
    suffix: "+",
    label: "Products Sold",
    description: "Across all categories",
    color: "text-violet-500",
    bg: "bg-violet-500/5",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    description: "Based on 12,000+ reviews",
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
  {
    icon: Globe,
    value: 120,
    suffix: "+",
    label: "Countries",
    description: "Worldwide shipping",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
];

function Counter({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const displayValue = value < 100 ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <span className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
      {displayValue}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-surface/40 border-y border-border/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            Our Achievements
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Numbers That Matter
          </h2>
          <p className="text-muted-foreground mt-3 text-base max-w-xl mx-auto">
            We are proud of what we have accomplished. Here are some highlights from our journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card border border-border/50 rounded-xl p-6 text-center hover:border-border/80 hover:shadow-sm transition-all duration-200"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <Counter value={stat.value} suffix={stat.suffix} isInView={isInView} />
              <p className="font-medium text-foreground text-sm mt-1.5">{stat.label}</p>
              <p className="text-muted-foreground text-[12px] mt-0.5">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
