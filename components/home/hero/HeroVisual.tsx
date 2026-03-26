"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";

const featuredProducts = [
  { id: 1, name: "Wireless Earbuds Pro", price: 149, originalPrice: 199, rating: 4.9, reviews: 2341, badge: "Best Seller" },
  { id: 2, name: "Smart Watch Series X", price: 299, originalPrice: 399, rating: 4.8, reviews: 1892, badge: "-25%" },
  { id: 3, name: "Premium Headphones", price: 199, originalPrice: 249, rating: 4.9, reviews: 3421, badge: "Hot" },
];

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative hidden lg:block"
    >
      <div className="relative z-10">
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-700 ease-out">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
            alt="Premium Store"
            width={600}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="bg-green-500 text-white mb-3">Official Store</Badge>
            <h3 className="text-2xl font-bold text-white mb-1">Premium Collection 2025</h3>
            <p className="text-white/80 text-sm">Free shipping on orders over $50</p>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-8 -right-8 bg-white dark:bg-card p-4 rounded-3xl shadow-2xl z-20 border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-green-500 fill-green-500" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">4.9/5</p>
              <p className="text-xs text-muted-foreground">12,000+ Reviews</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-4 -left-8 bg-white dark:bg-card p-4 rounded-3xl shadow-2xl z-20 border border-border/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">50,000+</p>
              <p className="text-xs text-muted-foreground">Happy Customers</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -left-12 bg-white dark:bg-card p-3 rounded-2xl shadow-xl z-20 border border-border/50"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="text-sm font-bold">98%</span>
            <span className="text-xs text-muted-foreground">Loved</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-[100px]" />
    </motion.div>
  );
}
