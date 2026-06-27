"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
          // Only show active promotion banners here
          setBanners(
            data.banners.filter((b: Banner) => b.type === "promotion"),
          );
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
    if ((banners || []).length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (banners || []).length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading || (banners || []).length === 0) return null;

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % (banners || []).length);
  const prev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + (banners || []).length) % (banners || []).length,
    );

  return (
    <section className="py-2 bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            Active Deployments
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            Strategic <span className="text-primary italic">Updates</span>
          </h2>
        </div>

        <div className="relative group rounded-[32px] md:rounded-[48px] overflow-hidden aspect-[4/5] sm:aspect-[16/9] md:aspect-[25/9] shadow-2xl shadow-primary/5 border border-border/40">
          {(banners || [])[currentIndex] && (
            <AnimatePresence mode="wait">
              <motion.div
                key={(banners || [])[currentIndex]._id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={(banners || [])[currentIndex].image && (banners || [])[currentIndex].image.trim() !== "" ? (banners || [])[currentIndex].image : getFallbackImage()}
                  alt={(banners || [])[currentIndex].title}
                  fill
                  className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage();
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/90 md:via-black/40 md:to-transparent flex flex-col justify-end md:justify-center p-8 sm:p-12 md:px-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-xl"
                  >
                    <div className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-4 opacity-70">
                      Live Status: Operational
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-4 sm:mb-6 uppercase">
                      {(banners || [])[currentIndex].title}
                    </h2>
                    {(banners || [])[currentIndex].subtitle && (
                      <p className="text-sm sm:text-lg md:text-xl text-white/60 font-medium mb-6 sm:mb-10 leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
                        {(banners || [])[currentIndex].subtitle}
                      </p>
                    )}
                    {(banners || [])[currentIndex].link && (
                      <Button
                        asChild
                        size="lg"
                        className="rounded-xl sm:rounded-2xl h-12 sm:h-14 px-8 sm:px-10 font-black text-[10px] sm:text-[11px] uppercase tracking-widest group/btn bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-105"
                      >
                        <Link
                          href={(banners || [])[currentIndex].link || ""}
                          className="flex items-center gap-3"
                        >
                          Initialize Access{" "}
                          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Controls */}
          {(banners || []).length > 1 && (
            <div className="absolute bottom-8 right-8 hidden sm:flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-black/20 backdrop-blur-xl border-white/10 text-white hover:bg-primary hover:border-primary transition-all"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-xl w-10 h-10 sm:w-12 sm:h-12 bg-black/20 backdrop-blur-xl border-white/10 text-white hover:bg-primary hover:border-primary transition-all"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Indicators */}
          {(banners || []).length > 1 && (
            <div className="absolute bottom-8 left-8 sm:bottom-10 sm:left-12 md:left-24 flex gap-2">
              {(banners || []).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "h-1 sm:h-1.5 rounded-full transition-all duration-500",
                    i === currentIndex
                      ? "w-8 sm:w-12 bg-primary"
                      : "w-3 sm:w-4 bg-white/20 hover:bg-white/40",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
