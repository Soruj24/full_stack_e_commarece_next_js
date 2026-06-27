"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Crown, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PremiumShowcase() {
  const items = [
    {
      icon: Crown,
      title: "Exclusive Collections",
      desc: "Curated premium products with limited availability.",
      color: "from-purple-600 to-fuchsia-500",
    },
    {
      icon: ShieldCheck,
      title: "Priority Security",
      desc: "Enterprise-grade protection and monitoring.",
      color: "from-emerald-600 to-teal-500",
    },
    {
      icon: Sparkles,
      title: "Luxury Experience",
      desc: "Refined visuals and smooth interactions.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-[480px] h-[480px] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-fuchsia-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Premium <span className="text-primary">UI</span>
            </h2>
            <p className="text-muted-foreground font-medium mt-2">
              Elevate your storefront with polished visuals and motion.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-[32px] border border-border/50 bg-card overflow-hidden shadow-2xl shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-[0.08] group-hover:opacity-[0.12] transition-opacity`} />
              <div className="relative p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-xl">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-medium mt-4">
                  {item.desc}
                </p>
                <div className="mt-8 flex justify-between items-center">
                  <div className="flex -space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 border border-white/20" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500/80 to-pink-500/40 border border-white/20" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/80 to-teal-500/40 border border-white/20" />
                  </div>
                  <Button
                    asChild
                    className="rounded-2xl bg-gradient-to-r from-primary to-fuchsia-500 text-white font-black shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-fuchsia-500/90"
                  >
                    <Link href="/products" className="flex items-center gap-2">
                      Explore <Sparkles className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PremiumShowcase;
