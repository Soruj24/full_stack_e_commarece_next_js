"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Flame, Loader2 } from "lucide-react";
import { IProduct } from "@/types";

export function TrendingProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const res = await fetch("/api/products?sortBy=rating&limit=4");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch trending products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-background flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-2 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-[0.2em] text-[10px] mb-2 bg-orange-500/10 w-fit px-4 py-1.5 rounded-full">
              <Flame className="w-3 h-3 fill-orange-500 animate-pulse" />
              Hot Right Now
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              Trending{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                Products
              </span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg max-w-xl">
              Discover the most popular items that everyone is talking about
              this week.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-900/30 dark:hover:bg-orange-950/30 dark:hover:text-orange-400 transition-colors"
          >
            <Link href="/products?sortBy=rating">View All Trending</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
