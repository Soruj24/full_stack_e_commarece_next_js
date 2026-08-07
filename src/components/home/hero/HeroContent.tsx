"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, CreditCard, Headphones } from "lucide-react";
import { useState, useEffect } from "react";

const rotatingWords = ["Premium Products", "Exclusive Deals", "Luxury Brands", "Top Electronics", "Fashion Styles"];

export function HeroContent() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = rotatingWords[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <div className="max-w-2xl">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border border-border/60 bg-surface"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span className="text-muted-foreground text-[12px] font-medium">
          Free shipping on orders over $50
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight mb-1 leading-[1.1] text-foreground">
          Discover
        </h1>
        <div className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-6 min-h-[1.2em] flex items-center">
          <span className="text-primary">
            {displayed}
            <span className="animate-pulse text-primary/40">|</span>
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
      >
        Shop thousands of curated premium products with unbeatable prices,
        lightning-fast shipping, and world-class customer support.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mb-10"
      >
        <Button size="lg" className="h-11 px-6 rounded-lg text-sm font-semibold group" asChild>
          <Link href="/products">
            Explore Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-11 px-6 rounded-lg text-sm font-semibold" asChild>
          <Link href="/about">Our Story</Link>
        </Button>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="pt-6 border-t border-border/40"
      >
        <p className="text-[10px] font-semibold text-muted-foreground/50 mb-4 uppercase tracking-[0.15em]">
          Trusted by 50,000+ customers
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Shield, label: "SSL Secured" },
            { icon: Truck, label: "Free Shipping" },
            { icon: CreditCard, label: "Secure Payment" },
            { icon: Headphones, label: "24/7 Support" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface/50 border border-border/30"
            >
              <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                <item.icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[12px] font-medium text-foreground">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
