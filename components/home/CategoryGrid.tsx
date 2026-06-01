"use client";

import Link from "next/link";
import {
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad,
  Shirt,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Laptops",
    icon: Laptop,
    href: "/products?category=laptops",
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    glow: "rgba(99, 102, 241, 0.4)",
    count: "240+ products",
    bg: "rgba(99, 102, 241, 0.08)",
  },
  {
    name: "Phones",
    icon: Smartphone,
    href: "/products?category=phones",
    gradient: "from-violet-600 via-purple-600 to-pink-600",
    glow: "rgba(139, 92, 246, 0.4)",
    count: "180+ products",
    bg: "rgba(139, 92, 246, 0.08)",
  },
  {
    name: "Watches",
    icon: Watch,
    href: "/products?category=watches",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    glow: "rgba(245, 158, 11, 0.4)",
    count: "95+ products",
    bg: "rgba(245, 158, 11, 0.08)",
  },
  {
    name: "Audio",
    icon: Headphones,
    href: "/products?category=audio",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    glow: "rgba(16, 185, 129, 0.4)",
    count: "120+ products",
    bg: "rgba(16, 185, 129, 0.08)",
  },
  {
    name: "Cameras",
    icon: Camera,
    href: "/products?category=cameras",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    glow: "rgba(244, 63, 94, 0.4)",
    count: "65+ products",
    bg: "rgba(244, 63, 94, 0.08)",
  },
  {
    name: "Gaming",
    icon: Gamepad,
    href: "/products?category=gaming",
    gradient: "from-indigo-500 via-violet-600 to-purple-700",
    glow: "rgba(124, 58, 237, 0.4)",
    count: "200+ products",
    bg: "rgba(124, 58, 237, 0.08)",
  },
  {
    name: "Fashion",
    icon: Shirt,
    href: "/products?category=fashion",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    glow: "rgba(236, 72, 153, 0.4)",
    count: "500+ products",
    bg: "rgba(236, 72, 153, 0.08)",
  },
  {
    name: "Home & Living",
    icon: Home,
    href: "/products?category=home",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    glow: "rgba(14, 165, 233, 0.4)",
    count: "300+ products",
    bg: "rgba(14, 165, 233, 0.08)",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export function CategoryGrid() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4"
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                color: "#a78bfa",
              }}
            >
              Browse Categories
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Shop by{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)",
                }}
              >
                Category
              </span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Explore our wide range of premium products
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full transition-all"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              color: "#a78bfa",
            }}
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={item}>
              <Link href={category.href} className="block group">
                <motion.div
                  whileHover={{
                    y: -8,
                    rotateX: 5,
                    rotateY: 5,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative overflow-hidden rounded-2xl p-5 text-center cursor-pointer"
                  style={{
                    background: category.bg,
                    border: "1px solid rgba(255,255,255,0.06)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Shimmer overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)" }}
                  />

                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: `inset 0 0 30px ${category.glow}` }}
                  />

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    style={{ boxShadow: `0 8px 25px ${category.glow}` }}
                  >
                    <category.icon className="w-7 h-7 text-white" />
                  </div>

                  <p className="font-bold text-sm text-foreground group-hover:text-white transition-colors leading-tight">
                    {category.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">{category.count}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-full"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              color: "#a78bfa",
            }}
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
