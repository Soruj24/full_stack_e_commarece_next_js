"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { IProduct } from "@/shared/types";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRailProps {
  title: string;
  eyebrow?: string;
  description?: string;
  query: string; // e.g. "sortBy=newest&limit=8"
  href: string;
  ctaLabel?: string;
  columns?: 2 | 3 | 4 | 5;
  limit?: number;
}

export function ProductRail({
  title,
  eyebrow,
  description,
  query,
  href,
  ctaLabel = "View all",
  columns = 4,
  limit = 8,
}: ProductRailProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sep = query.includes("?") ? "&" : "?";
        const res = await fetch(`/api/products${query.startsWith("?") ? query : `?${query}`}${query.includes("limit=") ? "" : `${sep}limit=${limit}`}`);
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error("ProductRail fetch failed", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, limit]);

  if (!loading && products.length === 0) return null;

  const loadingCols: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h2>
            {description && <p className="mt-3 text-base text-muted-foreground leading-relaxed">{description}</p>}
          </div>
          <Button asChild variant="ghost" className="w-fit group text-foreground hover:bg-accent/60">
            <Link href={href} className="inline-flex items-center gap-2">
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className={`grid gap-4 sm:gap-6 ${loadingCols[columns] || loadingCols[4]}`}>
            {Array.from({ length: Math.min(limit, columns === 5 ? 10 : 8) }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid columns={columns} gap="md">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.24), ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </ProductGrid>
        )}
      </div>
    </section>
  );
}
