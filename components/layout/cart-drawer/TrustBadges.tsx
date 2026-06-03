"use client";

import { ShieldCheck, RefreshCw, Truck } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="px-6 py-3 bg-zinc-50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/10">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span className="text-[9px] text-zinc-500">Secure Checkout</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span className="text-[9px] text-zinc-500">30-Day Returns</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Truck className="w-4 h-4 text-orange-600" />
          <span className="text-[9px] text-zinc-500">Free Shipping</span>
        </div>
      </div>
    </div>
  );
}
