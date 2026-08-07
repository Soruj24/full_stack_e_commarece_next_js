"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn, getFallbackImage } from "@/lib/utils";

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  type: string;
}

export function DynamicBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/admin/marketing/banners");
        const data = await res.json();
        if (data.success) {
          setBanners(data.banners.filter((b: Banner) => b.type === "promotion"));
        }
      } catch {
        console.error("Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading || banners.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-3">
            Promotions
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Featured Deals
          </h2>
        </div>

        <div className="relative group rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[16/9] md:aspect-[25/9] border border-border/40 shadow-lg">
          {banners[currentIndex] && (
            <AnimatePresence mode="wait">
              <motion.div
                key={banners[currentIndex]._id}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={banners[currentIndex].image && banners[currentIndex].image.trim() !== "" ? banners[currentIndex].image : getFallbackImage()}
                  alt={banners[currentIndex].title}
                  fill
                  className="object-cover transition-all duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage();
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center p-8 sm:p-12 md:px-20">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-lg"
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight mb-3">
                      {banners[currentIndex].title}
                    </h2>
                    {banners[currentIndex].subtitle && (
                      <p className="text-sm sm:text-base text-white/60 mb-6 max-w-md line-clamp-2">
                        {banners[currentIndex].subtitle}
                      </p>
                    )}
                    {banners[currentIndex].link && (
                      <Button asChild size="lg" className="rounded-xl h-11 px-6 font-medium">
                        <Link href={banners[currentIndex].link || ""}>
                          Shop Now
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {banners.length > 1 && (
            <>
              <div className="absolute bottom-6 right-6 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="secondary" size="icon" onClick={prev} className="w-9 h-9 rounded-lg bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-white/20" aria-label="Previous banner">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="icon" onClick={next} className="w-9 h-9 rounded-lg bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-white/20" aria-label="Next banner">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="absolute bottom-6 left-6 sm:left-12 md:left-20 flex gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === currentIndex ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
