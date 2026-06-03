"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop, Smartphone, Watch, Headphones,
  Camera, Gamepad2, Shirt, ShoppingBag, Star,
} from "lucide-react";
import { ICategory } from "@/types";
import { cn } from "@/lib/utils";

interface MobileNavCategoriesProps {
  categories: ICategory[];
  onClose: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  laptop: <Laptop className="h-4 w-4 sm:h-5 sm:w-5" />,
  phones: <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />,
  watches: <Watch className="h-4 w-4 sm:h-5 sm:w-5" />,
  headphones: <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />,
  camera: <Camera className="h-4 w-4 sm:h-5 sm:w-5" />,
  gamepad: <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />,
  shirt: <Shirt className="h-4 w-4 sm:h-5 sm:w-5" />,
  default: <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />,
};

const categoryGradients: Record<string, string> = {
  laptop: "from-blue-500 to-cyan-500",
  phones: "from-purple-500 to-pink-500",
  watches: "from-orange-500 to-red-500",
  headphones: "from-green-500 to-emerald-500",
  camera: "from-yellow-500 to-orange-500",
  gamepad: "from-indigo-500 to-violet-500",
  shirt: "from-pink-500 to-rose-500",
  default: "from-primary to-purple-500",
};

export function MobileNavCategories({ categories, onClose }: MobileNavCategoriesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
          Browse Categories
        </p>
        <Link
          href="/categories"
          onClick={onClose}
          className="text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {(categories || []).slice(0, 8).map((cat, idx) => {
          const gradient = categoryGradients[cat.icon || "default"];
          const icon = categoryIcons[cat.icon || "default"];
          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
            >
              <Link
                href={`/products?category=${cat.slug}`}
                onClick={onClose}
                className={cn(
                  "flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20",
                  "hover:from-primary/5 hover:to-primary/10 border border-transparent hover:border-primary/20",
                  "transition-all duration-300 group relative",
                )}
              >
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br",
                  gradient,
                  "flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                )}>
                  <div className="text-white">{icon}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-tight block">
                    {cat.name}
                  </span>
                  {cat.description && (
                    <span className="text-[9px] text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                      {cat.description}
                    </span>
                  )}
                </div>
                {cat.isFeatured && (
                  <div className="absolute top-2 right-2">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
