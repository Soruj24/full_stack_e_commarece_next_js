"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, CreditCard, Headphones, Star, Award, Users, ShoppingBag } from "lucide-react";

export function HeroContent() {
  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-8 border border-primary/20"
      >
        <Star className="w-4 h-4" />
        <span>#1 Rated Online Store</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
      >
        Discover Premium
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
          Products Online
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
      >
        Shop from thousands of premium products with unbeatable prices, 
        fast shipping, and exceptional customer service. Your satisfaction is our priority.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          size="lg"
          className="h-14 px-8 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
          asChild
        >
          <Link href="/products">
            Explore Products
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 px-8 rounded-2xl text-base font-bold border-2 hover:bg-primary/5"
          asChild
        >
          <Link href="/about">Our Story</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 pt-8 border-t border-border/50"
      >
        <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
          Trusted by 50,000+ customers worldwide
        </p>
        <div className="flex flex-wrap gap-8">
          {[
            { icon: Shield, label: "SSL Secured", desc: "256-bit encryption" },
            { icon: Truck, label: "Free Shipping", desc: "Orders over $50" },
            { icon: CreditCard, label: "Secure Payment", desc: "All cards accepted" },
            { icon: Headphones, label: "24/7 Support", desc: "Always here to help" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
