"use client";

import Link from "next/link";
import { Phone, Mail, Truck, Shield, RotateCcw } from "lucide-react";

export function TopNav() {
  return (
    <div className="w-full bg-gradient-to-r from-primary via-purple-600 to-pink-500 text-primary-foreground py-2 text-sm hidden md:block">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
            <Truck className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Free Shipping on $50+</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">30-Day Returns</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
            <Shield className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Secure Checkout</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/faq" className="hover:text-white/80 transition-colors text-xs font-medium">
            Help Center
          </Link>
          <Link href="/contact" className="hover:text-white/80 transition-colors text-xs font-medium">
            Contact Us
          </Link>
          <div className="flex items-center gap-2 border-l border-primary-foreground/20 pl-6">
            <Phone className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </div>
  );
}
