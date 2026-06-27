"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface GiftCardAmountSelectorProps {
  amounts: number[];
  selectedAmount: number | null;
  customAmount: string;
  currentAmount: number;
  onAmountSelect: (amount: number) => void;
  onCustomAmount: (value: string) => void;
}

export function GiftCardAmountSelector({ amounts, selectedAmount, customAmount, currentAmount, onAmountSelect, onCustomAmount }: GiftCardAmountSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {amounts.map((amount) => (
          <button key={amount} type="button" onClick={() => onAmountSelect(amount)}
            className={cn("p-4 rounded-xl border-2 font-bold text-lg transition-all", selectedAmount === amount ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}>
            ${amount}
          </button>
        ))}
      </div>
      <div>
        <Label htmlFor="custom-amount">Or enter custom amount</Label>
        <div className="relative mt-1.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input id="custom-amount" type="number" min="1" max="10000" placeholder="0.00"
            value={customAmount} onChange={(e) => onCustomAmount(e.target.value)} className="pl-7 text-lg" />
        </div>
      </div>
      {currentAmount > 0 && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground">Selected Amount</p>
          <p className="text-3xl font-bold text-primary">${currentAmount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
