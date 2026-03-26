"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Package, Heart } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Products",
    description: "Explore our extensive catalog of premium products across multiple categories. Use filters to find exactly what you need.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: ShoppingCart,
    number: "02",
    title: "Add to Cart",
    description: "Found something you love? Add it to your cart with a single click. Review your selections before checkout.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Package,
    number: "03",
    title: "Fast Delivery",
    description: "We process orders within 24 hours and partner with top carriers to ensure your products arrive safely and quickly.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Heart,
    number: "04",
    title: "Enjoy & Review",
    description: "Love your purchase? Leave a review to help others. Need help? Our support team is available 24/7.",
    color: "from-orange-500 to-red-500",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Shopping with us is easy. Follow these simple steps and enjoy a seamless experience.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-3xl p-8 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
                  <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="inline-block text-6xl font-black text-primary/10 mb-4">{step.number}</span>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
