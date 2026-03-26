"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, ShoppingBag, Star, Globe, Award, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Happy Customers",
    description: "And counting every day",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: ShoppingBag,
    value: 100000,
    suffix: "+",
    label: "Products Sold",
    description: "Across all categories",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    description: "Based on 12,000+ reviews",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    value: 120,
    suffix: "+",
    label: "Countries",
    description: "Worldwide shipping available",
    color: "from-green-500 to-emerald-500",
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
  return <span>{displayValue}{suffix}</span>;
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Our Achievements
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Numbers That Matter
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are proud of what we have accomplished. Here are some highlights from our journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border border-border rounded-3xl p-8 text-center hover:border-primary/30 transition-all duration-300">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                </div>
                <p className="text-lg font-bold text-foreground mb-1">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
