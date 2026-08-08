"use client";

import { ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export function CheckoutHeader() {
  const router = useRouter();

  return (
    <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tap-target"
            aria-label="Back to cart"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back to Cart</span>
          </button>
          <h1 className="text-base sm:text-xl font-black tracking-tight">
            <span className="hidden sm:inline">Secure </span>
            <span className="text-primary">Checkout</span>
          </h1>
          <div className="flex items-center gap-1.5 text-green-600">
            <Lock className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">SSL Encrypted</span>
          </div>
        </div>
      </div>
    </header>
  );
}
