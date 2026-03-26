"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { IProduct } from "@/types";

export function ProductRecommendations() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/products/recommendations");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            (data && data.error) || "Failed to fetch recommendations",
          );
        }
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as { products?: IProduct[] }).products)
            ? (data as { products: IProduct[] }).products
            : [];
        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if ((products || []).length === 0) return null;

  return (
    <section className="py-5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2 bg-primary/10 w-fit px-4 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3 fill-primary animate-pulse" />
              Personalized for you
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              Recommended <span className="text-primary">Products</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg max-w-xl">
              Based on your interests and browsing history, we think you&apos;ll
              love these.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 h-12 px-8 border-border/40 hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300 group"
          >
            <Link href="/products">
              Explore All
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {(products || []).map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
