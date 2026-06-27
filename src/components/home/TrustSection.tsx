"use client";

import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Headphones, Lock, CheckCircle, Award, Sparkles } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "SSL Encrypted",
    description: "256-bit bank-level security",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    color: "from-orange-500 to-red-500",
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
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Shop With Confidence
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Why Customers Trust Us
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We go above and beyond to ensure your shopping experience is safe, secure, and satisfying.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r ${badge.color} flex items-center justify-center mb-4 shadow-lg`}>
                <badge.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-8 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-2">Your Security is Our Priority</h3>
              <p className="text-muted-foreground max-w-lg">
                We use industry-leading security measures to protect your personal information and payment details.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {securityBadges.map((badge, index) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border"
                >
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 mt-12 opacity-60 grayscale">
          <span className="text-sm font-medium text-muted-foreground">Accepted Payments:</span>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-muted rounded-lg text-xs font-bold">VISA</div>
            <div className="px-4 py-2 bg-muted rounded-lg text-xs font-bold">Mastercard</div>
            <div className="px-4 py-2 bg-muted rounded-lg text-xs font-bold">PayPal</div>
            <div className="px-4 py-2 bg-muted rounded-lg text-xs font-bold">Apple Pay</div>
            <div className="px-4 py-2 bg-muted rounded-lg text-xs font-bold">Google Pay</div>
          </div>
        </div>
      </div>
    </section>
  );
}
