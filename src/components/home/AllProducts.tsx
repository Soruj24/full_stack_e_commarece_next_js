"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { IProduct } from "@/shared/types";

export function AllProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            Our Collection
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Explore All Products
          </h2>
          <p className="text-muted-foreground text-base mt-2 max-w-lg">
            Browse our extensive collection of high-quality products curated just for you.
          </p>
        </div>
        <Button asChild variant="ghost" className="text-primary hover:text-primary/80">
          <Link href="/products" className="flex items-center gap-2 text-sm font-medium">
            View Full Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center md:hidden">
        <Button asChild variant="outline" className="rounded-xl px-6 w-full">
          <Link href="/products">View Full Collection</Link>
        </Button>
      </div>
    </div>
  );
}
