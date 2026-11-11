"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  children?: Category[];
}

export function FeaturedCategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/categories?active=true&limit=8");
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.categories)) {
          const top = data.categories.filter((c: Category & { parent?: unknown }) => !c.parent).slice(0, 8);
          setCategories(top.length ? top : data.categories.slice(0, 8));
        }
      } catch (e) {
        console.error("Failed to fetch categories", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-surface/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Browse</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Featured Categories</h2>
            <p className="mt-3 text-base text-muted-foreground max-w-2xl">Explore curated collections designed for every style, space, and routine.</p>
          </div>
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? null : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    "group relative block overflow-hidden rounded-2xl border border-border/50 bg-card",
                    "aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] shadow-xs hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.2)] transition-all duration-300"
                  )}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted via-surface to-accent" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[11px] font-medium text-white mb-3">
                      <Layers className="h-3.5 w-3.5" />
                      Category
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">{cat.name}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                      Shop now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
