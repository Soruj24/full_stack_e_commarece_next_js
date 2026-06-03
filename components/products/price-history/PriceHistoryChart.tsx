"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, ArrowUp, ArrowDown, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePriceHistoryChart } from "@/hooks/use-price-history-chart";
import { PriceStat } from "./PriceStat";
import type { TimeRange } from "@/hooks/use-price-history-chart";

interface PriceHistoryChartProps {
  productId: string;
  productName?: string;
  currentPrice?: number;
  className?: string;
  compact?: boolean;
}

const timeRanges: { label: string; value: TimeRange; fullLabel: string }[] = [
  { label: "7D", value: "7d", fullLabel: "7 Days" },
  { label: "30D", value: "30d", fullLabel: "30 Days" },
  { label: "90D", value: "90d", fullLabel: "90 Days" },
  { label: "1Y", value: "1y", fullLabel: "1 Year" },
  { label: "All", value: "all", fullLabel: "All Time" },
];

export function PriceHistoryChart({ productId, productName, currentPrice, className, compact = false }: PriceHistoryChartProps) {
  const { priceHistory, isLoading, timeRange, setTimeRange, filteredPricePoints, chartData, trend, trendPercentage } = usePriceHistoryChart(productId);
  const [isExpanded, setIsExpanded] = useState(!compact);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center gap-3 p-8", className)}>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading price history...</span>
      </div>
    );
  }

  if (!priceHistory && !isLoading) return null;

  if (compact) {
    return (
      <div className={cn("bg-card border rounded-xl p-4", className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">Price Trend</span>
          <Badge variant={trend === "up" ? "destructive" : trend === "down" ? "default" : "secondary"} className="text-xs">
            {trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
            {trendPercentage >= 0 ? "+" : ""}{trendPercentage.toFixed(1)}%
          </Badge>
        </div>
        {priceHistory && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">${priceHistory.lowestPrice.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">lowest</span>
            <span className="text-lg font-bold ml-4">${priceHistory.highestPrice.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">highest</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("bg-card border rounded-2xl overflow-hidden", className)}>
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Price History</h3>
            {productName && <p className="text-sm text-muted-foreground mt-1">{productName}</p>}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="md:hidden">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {priceHistory && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PriceStat label="Current" value={`$${(currentPrice ?? priceHistory.currentPrice).toFixed(2)}`} icon={<DollarSign className="w-4 h-4" />} />
            <PriceStat label="Lowest" value={`$${priceHistory.lowestPrice.toFixed(2)}`} icon={<ArrowDown className="w-4 h-4" />} highlight />
            <PriceStat label="Highest" value={`$${priceHistory.highestPrice.toFixed(2)}`} icon={<ArrowUp className="w-4 h-4" />} />
            <PriceStat label={`${priceHistory.priceChangePercentage >= 0 ? "Increased" : "Decreased"}`}
              value={`${priceHistory.priceChangePercentage >= 0 ? "+" : ""}${priceHistory.priceChangePercentage.toFixed(1)}%`}
              icon={priceHistory.priceChangePercentage >= 0 ? <TrendingUp className="w-4 h-4 text-red-500" /> : <TrendingDown className="w-4 h-4 text-green-500" />}
              valueClassName={priceHistory.priceChangePercentage >= 0 ? "text-red-500" : "text-green-500"} />
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Calendar className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <div className="flex gap-1">
            {timeRanges.map((r) => (
              <Button key={r.value} variant={timeRange === r.value ? "default" : "outline"} size="sm"
                onClick={() => setTimeRange(r.value)} className="h-8 px-3 text-xs" title={r.fullLabel}>
                <span className="hidden md:inline">{r.fullLabel}</span><span className="md:hidden">{r.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-6">
          {chartData && filteredPricePoints.length > 1 ? (
            <>
              <div className="relative h-48 mb-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={chartData.areaPath} fill="url(#chartGradient)" className="transition-all duration-500" />
                  <path d={chartData.path} fill="none" stroke="var(--primary)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" className="transition-all duration-500" />
                  {chartData.points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="1" fill="var(--primary)" className="hover:r-2 transition-all" />
                  ))}
                </svg>
                <div className="absolute top-0 left-0 text-xs text-muted-foreground">${chartData.maxPrice.toFixed(2)}</div>
                <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">${chartData.minPrice.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{new Date(filteredPricePoints[0].date).toLocaleDateString()}</span>
                <span className={cn("flex items-center gap-1 font-medium", trend === "up" && "text-red-500", trend === "down" && "text-green-500", trend === "stable" && "text-muted-foreground")}>
                  {trend === "up" && <TrendingUp className="w-4 h-4" />}
                  {trend === "down" && <TrendingDown className="w-4 h-4" />}
                  {trend === "stable" && <Minus className="w-4 h-4" />}
                  {trendPercentage >= 0 ? "+" : ""}{trendPercentage.toFixed(1)}% ({timeRange})
                </span>
                <span className="text-muted-foreground">{new Date(filteredPricePoints[filteredPricePoints.length - 1].date).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground"><p>Not enough data for this time range</p></div>
          )}
        </motion.div>
      )}
    </div>
  );
}
