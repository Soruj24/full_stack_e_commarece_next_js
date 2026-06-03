"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "./CategoryCard";
import { categories } from "@/lib/data/category-grid-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

export function CategoryGrid() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%), " +
            "radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
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
                style={{ backgroundImage: "linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)" }}
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
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
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
