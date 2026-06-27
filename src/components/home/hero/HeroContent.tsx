"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck, CreditCard, Headphones, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const rotatingWords = ["Premium Products", "Exclusive Deals", "Luxury Brands", "Top Electronics", "Fashion Styles"];

export function HeroContent() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [shoppers, setShoppers] = useState(1284);

  // Typewriter effect
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

  // Live shoppers counter (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      setShoppers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl">
      {/* Live badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8 border"
        style={{
          background: "rgba(139, 92, 246, 0.12)",
          borderColor: "rgba(139, 92, 246, 0.25)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
        </span>
        <span className="text-violet-300 text-sm font-semibold">
          {shoppers.toLocaleString()} people shopping right now
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-[1.05] text-white">
          Discover
        </h1>
        <div className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-8 min-h-[1.2em] flex items-center">
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #e879f9 100%)",
            }}
          >
            {displayed}
            <span className="animate-pulse text-violet-400">|</span>
          </span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed font-medium"
      >
        Shop thousands of curated premium products with unbeatable prices,
        lightning-fast shipping, and world-class customer support.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 mb-14"
      >
        <Button
          size="lg"
          className="h-14 px-8 rounded-2xl text-base font-bold group relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.4), 0 4px 15px rgba(0,0,0,0.3)",
          }}
          asChild
        >
          <Link href="/products">
            <span className="relative z-10 flex items-center gap-2">
              Explore Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-14 px-8 rounded-2xl text-base font-bold border-2 text-white"
          style={{
            borderColor: "rgba(139, 92, 246, 0.4)",
            background: "rgba(139, 92, 246, 0.08)",
          }}
          asChild
        >
          <Link href="/about">
            <Zap className="w-4 h-4 mr-2 text-violet-400" />
            Our Story
          </Link>
        </Button>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="pt-8 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <p className="text-xs font-semibold text-slate-400 mb-5 uppercase tracking-[0.2em]">
          Trusted by 50,000+ customers worldwide
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: "SSL Secured", desc: "256-bit encryption" },
            { icon: Truck, label: "Free Shipping", desc: "Orders over $50" },
            { icon: CreditCard, label: "Secure Payment", desc: "All cards accepted" },
            { icon: Headphones, label: "24/7 Support", desc: "Always here to help" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(139, 92, 246, 0.2)" }}
              >
                <item.icon className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{item.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
