import type { GiftWrappingOption, GiftMessage } from "@/features/cart/types/gift-wrapping";

interface GiftSummaryBarProps {
  selectedOption: GiftWrappingOption;
  giftMessage?: GiftMessage;
}

export function GiftSummaryBar({ selectedOption, giftMessage }: GiftSummaryBarProps) {
  return (
    <div className="px-5 py-3 bg-primary/5 border-t border-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedOption.color }} />
          <span className="text-xs font-medium">
            {selectedOption.name}
            {giftMessage?.message ? " + Message" : ""}
          </span>
        </div>
        <span className="text-sm font-bold text-primary">+${selectedOption.price.toFixed(2)}</span>
      </div>
    </div>
  );
}
