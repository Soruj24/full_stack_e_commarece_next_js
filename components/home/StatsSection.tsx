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
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(99, 102, 241, 0.5)",
    lightColor: "#818cf8",
  },
  {
    icon: ShoppingBag,
    value: 100000,
    suffix: "+",
    label: "Products Sold",
    description: "Across all categories",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.5)",
    lightColor: "#a78bfa",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    description: "Based on 12,000+ reviews",
    gradient: "from-amber-400 to-orange-500",
    glow: "rgba(245, 158, 11, 0.5)",
    lightColor: "#fbbf24",
  },
  {
    icon: Globe,
    value: 120,
    suffix: "+",
    label: "Countries",
    description: "Worldwide shipping",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.5)",
    lightColor: "#34d399",
  },
];

function Counter({ value, suffix, isInView, lightColor }: { value: number; suffix: string; isInView: boolean; lightColor: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2200;
    const steps = 70;
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
    <span
      className="text-4xl md:text-5xl font-black tracking-tight"
      style={{ color: lightColor, textShadow: `0 0 30px ${lightColor}80` }}
    >
      {displayValue}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050508 0%, #0a0514 50%, #050508 100%)",
      }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
            <TrendingUp className="w-4 h-4" />
            Our Achievements
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Numbers That{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)" }}
            >
              Matter
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We are proud of what we have accomplished. Here are some highlights from our journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative"
            >
              {/* Card glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `0 0 50px ${stat.glow}`, filter: "blur(20px)" }}
              />

              <div
                className="relative rounded-3xl p-8 text-center overflow-hidden border transition-all duration-500 group-hover:border-opacity-50"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Inner glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glow}20 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-500`}
                  style={{ boxShadow: `0 8px 30px ${stat.glow}` }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                <div className="relative z-10 mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} isInView={isInView} lightColor={stat.lightColor} />
                </div>
                <p className="text-white font-bold text-lg mb-1 relative z-10">{stat.label}</p>
                <p className="text-slate-500 text-sm relative z-10">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom award badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-14 flex flex-wrap justify-center gap-6"
        >
          {[
            { icon: Award, text: "Best E-Commerce 2024", color: "#fbbf24" },
            { icon: Star, text: "Trustpilot Excellent", color: "#34d399" },
            { icon: TrendingUp, text: "Fastest Growing Store", color: "#a78bfa" },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-3 rounded-full"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <badge.icon className="w-4 h-4" style={{ color: badge.color }} />
              <span className="text-sm font-semibold text-slate-300">{badge.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
