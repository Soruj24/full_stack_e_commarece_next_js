"use client";

interface CartSummaryProps {
  subtotal: number;
  remainingForFreeShipping: number;
}

export function CartSummary({ subtotal, remainingForFreeShipping }: CartSummaryProps) {
  return (
    <div className="px-6 py-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">Subtotal</span>
        <span className="font-semibold">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">Shipping</span>
        <span className={remainingForFreeShipping > 0 ? "text-zinc-500" : "text-green-600 font-semibold"}>
          {remainingForFreeShipping > 0 ? "Calculated at checkout" : "FREE"}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">Tax</span>
        <span className="text-zinc-400 text-xs">Calculated at checkout</span>
      </div>
    </div>
  );
}
