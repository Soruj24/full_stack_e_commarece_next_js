"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePriceHistory } from "@/features/products/context/PriceHistoryContext";

interface PriceComparisonProps {
  productId: string;
  className?: string;
}

export function PriceComparisonBadge({ productId, className }: PriceComparisonProps) {
  const { getPriceHistory } = usePriceHistory();
  const priceHistory = getPriceHistory(productId);

  if (!priceHistory) return null;

  const diff = priceHistory.currentPrice - priceHistory.lowestPrice;

  if (diff <= 0) {
    return (
      <Badge className={cn("bg-green-500 text-white", className)}>
        <TrendingDown className="w-3 h-3 mr-1" />Lowest Price!
      </Badge>
    );
  }

  return (
    <Badge className={cn("bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", className)}>
      <TrendingUp className="w-3 h-3 mr-1" />${diff.toFixed(2)} above lowest
    </Badge>
  );
}
