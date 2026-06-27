"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Loader2, ArrowRight } from "lucide-react";

export function AllProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch more products for the "All Products" section
        const res = await fetch("/api/products?limit=12&sortBy=newest");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
    <section className="py-5 bg-muted/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2 bg-primary/10 w-fit px-4 py-1.5 rounded-full">
              <Package className="w-3 h-3 text-primary" />
              Our Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              Explore{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                All Products
              </span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg max-w-xl">
              Browse our extensive collection of high-quality products curated
              just for you.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 border-primary/20 hover:bg-primary/5 transition-colors group"
          >
            <Link href="/products" className="flex items-center gap-2">
              View Full Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 w-full border-primary/20 hover:bg-primary/5 transition-colors"
          >
            <Link href="/products">View Full Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
