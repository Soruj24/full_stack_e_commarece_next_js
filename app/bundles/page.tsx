"use client";

import { useBundle } from "@/context/BundleContext";
import { BundleGrid } from "@/components/products/BundleCard";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

export default function BundlesPage() {
  const { bundles, loading } = useBundle();

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Package className="w-4 h-4" />
              Special Offers
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Product <span className="text-primary">Bundles</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Save big with our curated product bundles. Get multiple items at
              incredible discounts.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-pulse"
              >
                <div className="relative aspect-square bg-muted/50" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-24 bg-muted/50 rounded" />
                    <div className="h-5 w-16 bg-muted/50 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted/50 rounded" />
                    <div className="h-4 w-3/4 bg-muted/50 rounded" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="h-8 w-20 bg-muted/50 rounded" />
                    <div className="h-4 w-16 bg-muted/50 rounded line-through" />
                  </div>
                  <div className="h-11 w-full bg-muted/50 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : bundles.length > 0 ? (
          <BundleGrid bundles={bundles} />
        ) : (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Bundles Available</h2>
            <p className="text-muted-foreground">
              Check back soon for exciting bundle deals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
