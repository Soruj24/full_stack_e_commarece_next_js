"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SalesHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function SalesHeader({
  dateRange,
  onDateRangeChange,
  onRefresh,
  loading,
}: SalesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Sales Analytics
        </h1>
        <p className="text-muted-foreground">
          Track sales performance, trends, and product insights.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px] h-10 rounded-2xl bg-card border-border/50 font-bold">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/50 bg-card">
            <SelectItem value="7d" className="font-bold">Last 7 Days</SelectItem>
            <SelectItem value="30d" className="font-bold">Last 30 Days</SelectItem>
            <SelectItem value="90d" className="font-bold">Last 90 Days</SelectItem>
            <SelectItem value="1y" className="font-bold">This Year</SelectItem>
            <SelectItem value="all" className="font-bold">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-2xl"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
