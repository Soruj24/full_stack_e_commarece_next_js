"use client";

import Link from "next/link";
import { Phone, Truck, RotateCcw, Headphones } from "lucide-react";
import { LanguageCurrencySwitcher } from "./LanguageCurrencySwitcher";

export function TopNav() {
  return (
    <div className="w-full bg-muted/40 border-b border-border/40 hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">Free shipping on orders $50+</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">30-day free returns</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/faq"
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Help Center
          </Link>
          <Link
            href="/contact"
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Us
          </Link>
          <div className="w-px h-3 bg-border" />
          <a
            href="tel:+15551234567"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Headphones className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">+1 (555) 123-4567</span>
          </a>
          <div className="w-px h-3 bg-border" />
          <LanguageCurrencySwitcher />
        </div>
      </div>
    </div>
  );
}
