"use client";

import { Users, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    label: "Active Users",
    value: "10K+",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Countries",
    value: "50+",
    icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Success Rate",
    value: "99.9%",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function AboutStats() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group p-10 bg-background rounded-[40px] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 text-center"
            >
              <div
                className={`mx-auto h-20 w-20 ${stat.bg} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
              <div className="text-5xl font-black text-foreground mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}