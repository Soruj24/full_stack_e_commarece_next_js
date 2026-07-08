"use client";

import { useState, useEffect, useMemo } from "react";
import { usePriceHistory, type PriceHistory } from "@/modules/products/context/PriceHistoryContext";

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "all";

export function usePriceHistoryChart(productId: string) {
  const { fetchPriceHistory, getPriceHistory, isLoading } = usePriceHistory();
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  useEffect(() => {
    const load = async () => {
      const cached = getPriceHistory(productId);
      if (cached) { setPriceHistory(cached); return; }
      const data = await fetchPriceHistory(productId);
      if (data) setPriceHistory(data);
    };
    load();
  }, [productId, fetchPriceHistory, getPriceHistory]);

  const filteredPricePoints = useMemo(() => {
    if (!priceHistory?.pricePoints) return [];
    const ranges: Record<TimeRange, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365, all: Infinity };
    const cutoff = new Date(Date.now() - ranges[timeRange] * 24 * 60 * 60 * 1000);
    return priceHistory.pricePoints.filter((p) => new Date(p.date) >= cutoff);
  }, [priceHistory, timeRange]);

  const chartData = useMemo(() => {
    if (filteredPricePoints.length === 0) return null;
    const prices = filteredPricePoints.map((p) => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;
    const toY = (price: number) => 100 - ((price - minPrice) / range) * 100;
    return {
      points: filteredPricePoints.map((p, i) => ({ ...p, x: (i / Math.max(filteredPricePoints.length - 1, 1)) * 100, y: toY(p.price) })),
      minPrice, maxPrice,
      path: filteredPricePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / Math.max(filteredPricePoints.length - 1, 1)) * 100} ${toY(p.price)}`).join(" "),
      areaPath: filteredPricePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / Math.max(filteredPricePoints.length - 1, 1)) * 100} ${toY(p.price)}`).join(" ") + " L 100 100 L 0 100 Z",
    };
  }, [filteredPricePoints]);

  const trend = useMemo(() => {
    if (filteredPricePoints.length < 2) return "stable" as const;
    const first = filteredPricePoints[0].price;
    const last = filteredPricePoints[filteredPricePoints.length - 1].price;
    return last > first ? "up" as const : last < first ? "down" as const : "stable" as const;
  }, [filteredPricePoints]);

  const trendPercentage = useMemo(() => {
    if (filteredPricePoints.length < 2) return 0;
    const first = filteredPricePoints[0].price;
    const last = filteredPricePoints[filteredPricePoints.length - 1].price;
    return ((last - first) / first) * 100;
  }, [filteredPricePoints]);

  return { priceHistory, isLoading, timeRange, setTimeRange, filteredPricePoints, chartData, trend, trendPercentage };
}
