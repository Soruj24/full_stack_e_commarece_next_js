"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePriceHistory, PriceHistory, PricePoint } from "@/context/PriceHistoryContext";

interface PriceHistoryChartProps {
  productId: string;
  productName?: string;
  currentPrice?: number;
  className?: string;
  compact?: boolean;
}

type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

export function PriceHistoryChart({
  productId,
  productName,
  currentPrice,
  className,
  compact = false,
}: PriceHistoryChartProps) {
  const { fetchPriceHistory, getPriceHistory, isLoading } = usePriceHistory();
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [isExpanded, setIsExpanded] = useState(!compact);

  useEffect(() => {
    const loadPriceHistory = async () => {
      const cached = getPriceHistory(productId);
      if (cached) {
        setPriceHistory(cached);
      } else {
        const data = await fetchPriceHistory(productId);
        if (data) {
          setPriceHistory(data);
        }
      }
    };
    loadPriceHistory();
  }, [productId, fetchPriceHistory, getPriceHistory]);

  const filteredPricePoints = useMemo(() => {
    if (!priceHistory?.pricePoints) return [];

    const now = new Date();
    const ranges: Record<TimeRange, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
      all: Infinity,
    };

    const days = ranges[timeRange];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return priceHistory.pricePoints.filter(
      (point) => new Date(point.date) >= cutoffDate
    );
  }, [priceHistory, timeRange]);

  const chartData = useMemo(() => {
    if (filteredPricePoints.length === 0) return null;

    const prices = filteredPricePoints.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;

    return {
      points: filteredPricePoints.map((point, index) => ({
        ...point,
        x: (index / Math.max(filteredPricePoints.length - 1, 1)) * 100,
        y: 100 - ((point.price - minPrice) / range) * 100,
      })),
      minPrice,
      maxPrice,
      path: filteredPricePoints
        .map((point, index) => {
          const x = (index / Math.max(filteredPricePoints.length - 1, 1)) * 100;
          const y = 100 - ((point.price - minPrice) / range) * 100;
          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" "),
      areaPath: `
        ${filteredPricePoints
          .map((point, index) => {
            const x = (index / Math.max(filteredPricePoints.length - 1, 1)) * 100;
            const y = 100 - ((point.price - minPrice) / range) * 100;
            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")}
        L 100 100 L 0 100 Z
      `,
    };
  }, [filteredPricePoints]);

  const trend = useMemo(() => {
    if (filteredPricePoints.length < 2) return "stable";
    const first = filteredPricePoints[0].price;
    const last = filteredPricePoints[filteredPricePoints.length - 1].price;
    if (last > first) return "up";
    if (last < first) return "down";
    return "stable";
  }, [filteredPricePoints]);

  const trendPercentage = useMemo(() => {
    if (filteredPricePoints.length < 2) return 0;
    const first = filteredPricePoints[0].price;
    const last = filteredPricePoints[filteredPricePoints.length - 1].price;
    return ((last - first) / first) * 100;
  }, [filteredPricePoints]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center gap-3 p-8", className)}>
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading price history...</span>
      </div>
    );
  }

  if (!priceHistory && !isLoading) {
    return null;
  }

  const timeRanges: { label: string; value: TimeRange; fullLabel: string }[] = [
    { label: "7D", value: "7d", fullLabel: "7 Days" },
    { label: "30D", value: "30d", fullLabel: "30 Days" },
    { label: "90D", value: "90d", fullLabel: "90 Days" },
    { label: "1Y", value: "1y", fullLabel: "1 Year" },
    { label: "All", value: "all", fullLabel: "All Time" },
  ];

  if (compact) {
    return (
      <div className={cn("bg-card border rounded-xl p-4", className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Price Trend
          </span>
          <Badge
            variant={trend === "up" ? "destructive" : trend === "down" ? "default" : "secondary"}
            className="text-xs"
          >
            {trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
            {trendPercentage >= 0 ? "+" : ""}
            {trendPercentage.toFixed(1)}%
          </Badge>
        </div>
        {priceHistory && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">
              ${priceHistory.lowestPrice.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">lowest</span>
            <span className="text-lg font-bold ml-4">
              ${priceHistory.highestPrice.toFixed(2)}
            </span>
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
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Price History
            </h3>
            {productName && (
              <p className="text-sm text-muted-foreground mt-1">{productName}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        {priceHistory && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PriceStat
              label="Current"
              value={`$${currentPrice?.toFixed(2) || priceHistory.currentPrice.toFixed(2)}`}
              icon={<DollarSign className="w-4 h-4" />}
            />
            <PriceStat
              label="Lowest"
              value={`$${priceHistory.lowestPrice.toFixed(2)}`}
              icon={<ArrowDown className="w-4 h-4" />}
              highlight
            />
            <PriceStat
              label="Highest"
              value={`$${priceHistory.highestPrice.toFixed(2)}`}
              icon={<ArrowUp className="w-4 h-4" />}
            />
            <PriceStat
              label={`${priceHistory.priceChangePercentage >= 0 ? "Increased" : "Decreased"}`}
              value={`${priceHistory.priceChangePercentage >= 0 ? "+" : ""}${priceHistory.priceChangePercentage.toFixed(1)}%`}
              icon={
                priceHistory.priceChangePercentage >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )
              }
              valueClassName={
                priceHistory.priceChangePercentage >= 0
                  ? "text-red-500"
                  : "text-green-500"
              }
            />
          </div>
        )}

        <div className="flex items-center gap-2 mt-4">
          <Calendar className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.value)}
                className="h-8 px-3 text-xs"
                title={range.fullLabel}
              >
                <span className="hidden md:inline">{range.fullLabel}</span>
                <span className="md:hidden">{range.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-6"
        >
          {chartData && filteredPricePoints.length > 1 ? (
            <>
              <div className="relative h-48 mb-4">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={chartData.areaPath}
                    fill="url(#chartGradient)"
                    className="transition-all duration-500"
                  />
                  <path
                    d={chartData.path}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="0.5"
                    vectorEffect="non-scaling-stroke"
                    className="transition-all duration-500"
                  />
                  {chartData.points.map((point, idx) => (
                    <circle
                      key={idx}
                      cx={point.x}
                      cy={point.y}
                      r="1"
                      fill="var(--primary)"
                      className="hover:r-2 transition-all"
                    />
                  ))}
                </svg>

                <div className="absolute top-0 left-0 text-xs text-muted-foreground">
                  ${chartData.maxPrice.toFixed(2)}
                </div>
                <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">
                  ${chartData.minPrice.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {new Date(filteredPricePoints[0].date).toLocaleDateString()}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    trend === "up" && "text-red-500",
                    trend === "down" && "text-green-500",
                    trend === "stable" && "text-muted-foreground"
                  )}
                >
                  {trend === "up" && <TrendingUp className="w-4 h-4" />}
                  {trend === "down" && <TrendingDown className="w-4 h-4" />}
                  {trend === "stable" && <Minus className="w-4 h-4" />}
                  {trendPercentage >= 0 ? "+" : ""}
                  {trendPercentage.toFixed(1)}% ({timeRange})
                </span>
                <span className="text-muted-foreground">
                  {new Date(
                    filteredPricePoints[filteredPricePoints.length - 1].date
                  ).toLocaleDateString()}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Not enough data for this time range</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function PriceStat({
  label,
  value,
  icon,
  highlight,
  valueClassName,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "p-3 rounded-xl",
        highlight
          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : "bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <p className={cn("text-lg font-bold", valueClassName)}>{value}</p>
    </div>
  );
}

interface PriceComparisonProps {
  productId: string;
  className?: string;
}

export function PriceComparisonBadge({ productId, className }: PriceComparisonProps) {
  const { getPriceHistory } = usePriceHistory();
  const priceHistory = getPriceHistory(productId);

  if (!priceHistory) return null;

  const currentPrice = priceHistory.currentPrice;
  const lowestPrice = priceHistory.lowestPrice;
  const difference = currentPrice - lowestPrice;

  if (difference <= 0) {
    return (
      <Badge className={cn("bg-green-500 text-white", className)}>
        <TrendingDown className="w-3 h-3 mr-1" />
        Lowest Price!
      </Badge>
    );
  }

  return (
    <Badge className={cn("bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", className)}>
      <TrendingUp className="w-3 h-3 mr-1" />
      ${difference.toFixed(2)} above lowest
    </Badge>
  );
}
