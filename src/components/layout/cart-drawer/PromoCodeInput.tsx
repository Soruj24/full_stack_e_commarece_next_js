"use client";

import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoCodeInput() {
  return (
    <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/10">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Promo code"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-primary"
          />
        </div>
        <Button variant="outline" className="rounded-xl px-4">Apply</Button>
      </div>
    </div>
  );
}
