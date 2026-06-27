import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { PriceHistoryChart } from "@/components/products/PriceHistory";

interface Props {
  productId: string;
  productName: string;
  currentPrice: number;
}

export function ProductTrustBadges({ productId, productName, currentPrice }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Truck, text: "Free Shipping" },
          { icon: ShieldCheck, text: "2 Year Warranty" },
          { icon: RotateCcw, text: "30 Day Return" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col items-center text-center space-y-3">
            <Icon className="w-6 h-6 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest">{text}</p>
          </div>
        ))}
      </div>
      <PriceHistoryChart productId={productId} productName={productName} currentPrice={currentPrice} className="mt-6" />
    </>
  );
}
