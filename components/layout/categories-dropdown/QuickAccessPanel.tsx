"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface QuickAccessPanelProps {
  onClose: () => void;
}

export function QuickAccessPanel({ onClose }: QuickAccessPanelProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-[280px] bg-zinc-50/50 dark:bg-black/20 py-5 px-4 border-l border-zinc-100 dark:border-white/10">
      <div className="mb-3 px-2">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Quick Access</h4>
      </div>
      <div className="space-y-[2px]">
        <Link href="/products?sort=newest" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group">
          <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
            <span className="text-emerald-600 text-sm">✨</span>
          </div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">New Arrivals</span>
        </Link>
        <Link href="/products?sort=bestselling" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group">
          <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
            <span className="text-amber-600 text-sm">🔥</span>
          </div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">Best Sellers</span>
        </Link>
        <Link href="/products?sale=true" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-white/10 transition-colors group">
          <div className="w-8 h-8 rounded-md bg-rose-500/10 flex items-center justify-center">
            <span className="text-rose-600 text-sm">⚡</span>
          </div>
          <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">On Sale</span>
        </Link>
      </div>
    </motion.div>
  );
}
