"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useSaveForLater } from "@/features/cart/context/SaveForLaterContext";

export function SaveForLaterWidget() {
  const { getSavedCount } = useSaveForLater();
  const count = getSavedCount();

  if (count === 0) return null;

  return (
    <Link href="/saved">
      <div className="fixed bottom-20 right-4 z-40">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-2xl shadow-2xl border p-4 cursor-pointer hover:shadow-3xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{count}</span>
            </div>
            <div>
              <p className="font-semibold text-sm">Saved Items</p>
              <p className="text-xs text-muted-foreground">{count} item{count !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
