"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Zap, TrendingUp } from "lucide-react";

const floatingCards = [
  {
    id: 1,
    name: "AirPods Pro Max",
    price: "$549",
    originalPrice: "$699",
    rating: 4.9,
    reviews: "12.4k",
    badge: "🔥 Hot",
    badgeColor: "from-orange-500 to-red-500",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=300&h=300&fit=crop",
    delay: 0,
    position: "top-0 right-0",
    animate: "animate-float",
  },
  {
    id: 2,
    name: "MacBook Pro M3",
    price: "$1,299",
    originalPrice: "$1,599",
    rating: 4.8,
    reviews: "8.2k",
    badge: "⚡ New",
    badgeColor: "from-violet-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop",
    delay: 0.5,
    position: "bottom-16 -left-6",
    animate: "animate-float-delayed",
  },
  {
    id: 3,
    name: "Smart Watch Ultra",
    price: "$399",
    originalPrice: "$499",
    rating: 4.7,
    reviews: "5.6k",
    badge: "✨ Sale",
    badgeColor: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    delay: 1,
    position: "top-1/2 -right-4",
    animate: "animate-float",
  },
];

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative hidden lg:flex items-center justify-center"
      style={{ minHeight: "600px" }}
    >
      {/* Central glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 80%)",
          filter: "blur(40px)",
        }}
      />

      {/* Main hero image */}
      <div
        className="relative z-10 rounded-[40px] overflow-hidden"
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.15)",
          width: "360px",
          height: "480px",
          transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
        }}
      >
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=720&h=960&fit=crop"
          alt="Premium Store"
          fill
          className="object-cover"
          priority
          sizes="360px"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Bottom label */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white mb-2"
            style={{ background: "rgba(16, 185, 129, 0.9)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Official Store
          </div>
          <h3 className="text-xl font-bold text-white">Premium Collection 2025</h3>
          <p className="text-white/70 text-sm">Free shipping on orders over $50</p>
        </div>
      </div>

      {/* Floating product cards */}
      {floatingCards.map((card) => (
        <motion.div
          key={card.id}
          className={`absolute z-20 ${card.animate}`}
          style={{ animationDelay: `${card.delay}s` }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + card.delay * 0.3, duration: 0.5 }}
        >
          <div
            className="rounded-2xl p-3.5 w-52"
            style={{
              background: "rgba(15, 10, 30, 0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/10">
                <Image
                  src={card.image}
                  alt={card.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold leading-tight truncate">{card.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-[10px] font-bold">{card.rating}</span>
                  <span className="text-slate-400 text-[10px]">({card.reviews})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-violet-400 text-sm font-black">{card.price}</span>
                <span className="text-slate-500 text-xs line-through ml-1.5">{card.originalPrice}</span>
              </div>
              <div
                className={`text-[10px] font-bold text-white px-2 py-1 rounded-lg bg-gradient-to-r ${card.badgeColor}`}
              >
                {card.badge}
              </div>
            </div>
            <button
              className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{ background: "rgba(139, 92, 246, 0.25)", border: "1px solid rgba(139, 92, 246, 0.3)" }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </motion.div>
      ))}

      {/* Stats floating pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute top-8 left-0 z-20 animate-float-delayed"
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(15, 10, 30, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(167, 139, 250, 0.2)" }}>
            <TrendingUp className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-white text-sm font-black leading-none">50,000+</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Happy Customers</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute -bottom-2 right-8 z-20 animate-float"
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(15, 10, 30, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(234, 179, 8, 0.2)" }}>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <p className="text-white text-sm font-black leading-none">4.9 / 5.0</p>
            <p className="text-slate-400 text-[11px] mt-0.5">12,000+ Reviews</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute top-1/2 left-0 -translate-y-1/2 z-20"
      >
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-bold">98% Love This</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
