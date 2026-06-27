import { PriceComparisonBadge } from "@/components/products/PriceHistory";

interface Props {
  price: number;
  discountPrice?: number;
  productId: string;
}

export function ProductPricing({ price, discountPrice, productId }: Props) {
  const displayPrice = (discountPrice || price || 0).toFixed(2);

  return (
    <div className="space-y-2">
      {(discountPrice || price) && (
        <p className="text-muted-foreground line-through font-bold text-lg">
          ${((discountPrice || price) * 1.15).toFixed(2)}
        </p>
      )}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-5xl font-black tracking-tighter">${displayPrice}</span>
        {discountPrice && price && discountPrice < price && (
          <div className="flex flex-col gap-2">
            <span className="bg-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Save {Math.round((1 - discountPrice / price) * 100)}%
            </span>
            <PriceComparisonBadge productId={productId} />
          </div>
        )}
        {(!discountPrice || discountPrice >= price) && (
          <PriceComparisonBadge productId={productId} />
        )}
      </div>
    </div>
  );
}
