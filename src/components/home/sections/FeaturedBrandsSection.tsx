"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Brand {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
}

export function FeaturedBrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/brands?isActive=true&limit=12");
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.brands)) {
          setBrands(data.brands);
        }
      } catch (e) {
        console.error("Failed to fetch brands", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Partners</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Featured Brands</h2>
          <p className="mt-3 text-base text-muted-foreground">Discover products from trusted names and emerging labels across our catalog.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : brands.length === 0 ? null : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={brand._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
              >
                <Link
                  href={`/products?brand=${encodeURIComponent(brand.slug || brand.name)}`}
                  className="group flex h-24 items-center justify-center rounded-2xl border border-border/50 bg-card/70 px-4 text-center transition-all duration-250 hover:border-border hover:bg-card hover:shadow-[0_10px_30px_-16px_rgba(0,0,0,0.18)]"
                >
                  {brand.logo ? (
                    <div className="relative h-10 w-full">
                      <Image src={brand.logo} alt={brand.name} fill className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" sizes="160px" />
                    </div>
                  ) : (
                    <span className="text-sm font-semibold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">
                      {brand.name}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
