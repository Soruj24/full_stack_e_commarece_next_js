"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartCheckoutButtonProps {
  isLoading: boolean;
  onCheckout: () => void;
}

export function CartCheckoutButton({ isLoading, onCheckout }: CartCheckoutButtonProps) {
  return (
    <div className="px-6 pb-4">
      <Button onClick={onCheckout} className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
      <p className="text-[10px] text-center text-zinc-400 mt-2">
        Taxes and shipping calculated at checkout
      </p>
    </div>
  );
}
