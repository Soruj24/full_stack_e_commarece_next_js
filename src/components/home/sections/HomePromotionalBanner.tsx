"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomePromotionalBanner() {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-foreground text-background px-6 py-12 sm:px-12 sm:py-16"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium mb-5">
                <Sparkles className="h-3.5 w-3.5" />
                Limited-time promotion
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05]">
                Elevate your everyday with curated essentials.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-background/75 max-w-xl leading-relaxed">
                Discover special offers across top categories, with premium picks, fast delivery, and seamless checkout.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" variant="secondary" className="rounded-xl h-12 px-6">
                <Link href="/products?sale=true" className="inline-flex items-center gap-2">
                  Shop special offers <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl h-12 px-6 border-white/20 bg-transparent text-background hover:bg-white/10 hover:text-background">
                <Link href="/products?sort=newest">Explore new arrivals</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
