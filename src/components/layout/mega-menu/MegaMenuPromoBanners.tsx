"use client";

import Link from "next/link";
import { ArrowRight, Gem, Home, Percent } from "lucide-react";

interface MegaMenuPromoBannersProps {
  onClose: () => void;
}

export function MegaMenuPromoBanners({ onClose }: MegaMenuPromoBannersProps) {
  return (
    <div className="mt-8 pt-6 border-t border-border/50">
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/products?sort=newest"
          onClick={onClose}
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-500/20 hover:border-green-500/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-green-600 dark:text-green-500">
              New Arrivals
            </p>
            <p className="text-[10px] text-muted-foreground">Fresh picks daily</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-green-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/products?sort=bestselling"
          onClick={onClose}
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border border-yellow-500/20 hover:border-yellow-500/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-yellow-600 dark:text-yellow-500">
              Best Sellers
            </p>
            <p className="text-[10px] text-muted-foreground">Most loved items</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-yellow-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/products?sale=true"
          onClick={onClose}
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 border border-red-500/20 hover:border-red-500/40 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Percent className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-500">
              On Sale
            </p>
            <p className="text-[10px] text-muted-foreground">Up to 70% off</p>
          </div>
          <ArrowRight className="w-4 h-4 ml-auto text-red-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
