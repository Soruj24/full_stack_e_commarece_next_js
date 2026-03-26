"use client";

import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Loader2, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
            <Heart className="w-16 h-16 text-primary/20" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-xl shadow-primary/20">
            0
          </div>
        </div>
        <div className="space-y-3 max-w-sm">
          <h2 className="text-4xl font-black tracking-tighter">
            Your Wishlist is <span className="text-primary">Empty</span>
          </h2>
          <p className="text-muted-foreground font-medium">
            Looks like you haven&apos;t added anything to your wishlist yet. Start
            curating your dream collection.
          </p>
        </div>
        <Link href="/products">
          <Button
            variant="default"
            className="rounded-2xl px-12 h-14 font-black text-lg shadow-2xl shadow-primary/20 gap-3"
          >
            Explore Products <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-border/50 pb-8">
            <h1 className="text-5xl font-black tracking-tighter">
              My <span className="text-primary">Wishlist</span>
            </h1>
            <span className="text-xs font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-1.5 rounded-full">
              {wishlist.length} {wishlist.length === 1 ? "Item" : "Items"}
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
