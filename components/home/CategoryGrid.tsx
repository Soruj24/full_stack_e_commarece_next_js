"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "Laptops", icon: Laptop, href: "/products?category=laptops" },
  { name: "Phones", icon: Smartphone, href: "/products?category=phones" },
  { name: "Watches", icon: Watch, href: "/products?category=watches" },
  { name: "Audio", icon: Headphones, href: "/products?category=audio" },
  { name: "Cameras", icon: Camera, href: "/products?category=cameras" },
  { name: "Gaming", icon: Gamepad, href: "/products?category=gaming" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function CategoryGrid() {
  return (
    <section className="py-10 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Explore our wide range of premium products
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex text-primary font-bold hover:underline items-center gap-1"
          >
            View All Categories
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <motion.div
                variants={item}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="h-full group"
              >
                <Card className="h-full border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardContent className="flex flex-col items-center justify-center p-8 h-full relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
