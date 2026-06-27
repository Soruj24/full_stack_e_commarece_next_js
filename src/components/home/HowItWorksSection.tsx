"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Package, Heart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Browse Products",
    description:
      "Explore our extensive catalog of premium products across multiple categories. Use filters to find exactly what you need.",
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(99, 102, 241, 0.4)",
    lineColor: "rgba(99, 102, 241, 0.3)",
  },
  {
    icon: ShoppingCart,
    number: "02",
    title: "Add to Cart",
    description:
      "Found something you love? Add it to your cart with a single click. Review your selections before checkout.",
    gradient: "from-violet-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.4)",
    lineColor: "rgba(139, 92, 246, 0.3)",
  },
  {
    icon: Package,
    number: "03",
    title: "Fast Delivery",
    description:
      "We process orders within 24 hours and partner with top carriers to ensure your products arrive safely and on time.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.4)",
    lineColor: "rgba(16, 185, 129, 0.3)",
  },
  {
    icon: Heart,
    number: "04",
    title: "Enjoy & Review",
    description:
      "Love your purchase? Leave a review to help others. Need help? Our support team is available 24/7.",
    gradient: "from-rose-500 to-pink-600",
    glow: "rgba(244, 63, 94, 0.4)",
    lineColor: "rgba(244, 63, 94, 0.3)",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              color: "#a78bfa",
            }}
          >
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            How It{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)" }}
            >
              Works
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Shopping with us is easy. Follow these simple steps and enjoy a seamless experience.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3), rgba(16,185,129,0.3), rgba(244,63,94,0.3))",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div
                  className="rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `0 0 40px ${step.glow}`, filter: "blur(20px)" }}
                  />

                  {/* Step number */}
                  <div
                    className="absolute top-4 right-4 text-4xl font-black"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${step.glow.replace("rgba(", "rgb(").replace(", 0.4)", ")")}, transparent)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      opacity: 0.15,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-500`}
                    style={{ boxShadow: `0 10px 30px ${step.glow}` }}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground relative z-10">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed relative z-10">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-14 z-20 items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
