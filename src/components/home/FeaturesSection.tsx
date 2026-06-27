"use client";

import { motion } from "framer-motion";
import { Shield, Truck, BadgeCheck, RotateCcw, CreditCard, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "SSL encrypted checkout with 256-bit encryption. Your data is always protected.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express shipping available. Most orders delivered within 2-5 business days.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BadgeCheck,
    title: "Quality Guarantee",
    description: "Handpicked products with quality assurance. Only the best reaches our shelves.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. Not satisfied? Get a full refund.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options including installment plans. Shop your way.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "24/7 customer service by real humans. We're here to help anytime.",
    color: "from-indigo-500 to-violet-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            The Shop Experience
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are committed to providing the best shopping experience with these premium benefits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className={`w-16 h-16 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
