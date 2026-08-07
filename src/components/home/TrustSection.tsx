"use client";

import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Headphones, Lock, CheckCircle, Award, Sparkles } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "SSL Encrypted",
    description: "256-bit bank-level security",
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
    color: "text-violet-500",
    bg: "bg-violet-500/5",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    color: "text-amber-500",
    bg: "bg-amber-500/5",
  },
];

const securityBadges = [
  { icon: Lock, label: "Secure Checkout" },
  { icon: CheckCircle, label: "Verified Seller" },
  { icon: Award, label: "Quality Guaranteed" },
  { icon: Sparkles, label: "Authentic Products" },
];

export function TrustSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            Shop With Confidence
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
            Why Customers Trust Us
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            We go above and beyond to ensure your shopping experience is safe, secure, and satisfying.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true }}
              className="bg-card border border-border/50 rounded-xl p-5 text-center hover:border-border/80 hover:shadow-sm transition-all duration-200"
            >
              <div className={`w-11 h-11 mx-auto rounded-xl ${badge.bg} flex items-center justify-center mb-3`}>
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </div>
              <h3 className="font-semibold text-[14px] text-foreground mb-1">{badge.title}</h3>
              <p className="text-[12px] text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-card border border-border/50 rounded-xl p-6 sm:p-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1">Your Security is Our Priority</h3>
              <p className="text-muted-foreground text-[13px] max-w-lg">
                We use industry-leading security measures to protect your personal information and payment details.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {securityBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border/40 text-[12px] font-medium text-foreground"
                >
                  <badge.icon className="w-3.5 h-3.5 text-primary" />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-10 text-[12px] text-muted-foreground/50">
          <span className="font-medium">Accepted:</span>
          <div className="flex items-center gap-3">
            {["VISA", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-md bg-surface border border-border/30 text-[11px] font-semibold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
