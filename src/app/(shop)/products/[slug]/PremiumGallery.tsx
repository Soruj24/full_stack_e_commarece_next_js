"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
} from "lucide-react";
import { cn, getSafeImageSrc, getFallbackImage } from "@/lib/utils";

interface Props {
  images: string[];
  productName: string;
  categorySlug?: string;
}

export function PremiumGallery({ images, productName, categorySlug }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  const validImages =
    images?.length > 0 ? images : ["/placeholder-product.svg"];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isZoomed || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    [isZoomed]
  );

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
    setRotation(0);
    const thumb = thumbnailScrollRef.current?.children[index] as HTMLElement;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const goPrev = () =>
    goTo(activeIndex === 0 ? validImages.length - 1 : activeIndex - 1);
  const goNext = () =>
    goTo(activeIndex === validImages.length - 1 ? 0 : activeIndex + 1);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    if (!isZoomed) setRotation(0);
  };

  // Touch swipe handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    // Only swipe if horizontal movement > vertical (avoid conflict with scroll)
    if (dx > 10 && dx > dy * 1.5) {
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (dx < -threshold) {
      goNext();
    } else if (dx > threshold) {
      goPrev();
    }
    touchStartX.current = 0;
    touchStartY.current = 0;
    isSwiping.current = false;
  }, [activeIndex, validImages.length]);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          ref={containerRef}
          className={cn(
            "relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-border/30 shadow-2xl shadow-black/5 group select-none",
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={getSafeImageSrc(validImages[activeIndex], categorySlug)}
                alt={`${productName} - Image ${activeIndex + 1}`}
                fill
                priority={activeIndex === 0}
                className={cn(
                  "object-cover transition-transform duration-300 ease-out",
                  isZoomed && "scale-[2.5]"
                )}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        transform: `rotate(${rotation}deg) scale(2.5)`,
                      }
                    : { transform: `rotate(${rotation}deg)` }
                }
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Image counter badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-semibold z-10">
            {activeIndex + 1} / {validImages.length}
          </div>

          {/* Zoom indicator — always visible on mobile */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-2 text-white text-xs font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isZoomed ? "Click to zoom out" : "Hover to zoom"}</span>
            </div>
            {isZoomed && (
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
                {Math.round(zoomPos.x)}%, {Math.round(zoomPos.y)}%
              </div>
            )}
          </div>

          {/* Nav arrows — always visible on mobile, hover on desktop */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Action buttons — always visible on mobile, hover on desktop */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className="w-10 h-10 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110"
              title={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? (
                <ZoomOut className="w-4 h-4" />
              ) : (
                <ZoomIn className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => (r + 90) % 360);
              }}
              className="w-10 h-10 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110"
              title="Rotate"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightbox(true);
              }}
              className="w-10 h-10 rounded-xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:scale-110"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Slider */}
        {validImages.length > 1 && (
          <div
            ref={thumbnailScrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
          >
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  "relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 hover:opacity-80",
                  activeIndex === idx
                    ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10 scale-95"
                    : "border-transparent hover:border-primary/30"
                )}
              >
                <Image
                  src={getSafeImageSrc(img, categorySlug)}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightbox(false)}
          >
            <button
              onClick={() => setIsLightbox(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[90vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={getSafeImageSrc(validImages[activeIndex], categorySlug)}
                alt={`${productName} - Image ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox thumbnails */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {validImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(idx);
                  }}
                  className={cn(
                    "w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                    activeIndex === idx
                      ? "border-white scale-95"
                      : "border-transparent opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={getSafeImageSrc(img, categorySlug)}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
