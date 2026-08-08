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
import { PageHeader } from "@/components/admin/ui/PageHeader";

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
    <PageHeader
      title="Sales Analytics"
      description="Track sales performance, trends, and product insights."
      action={
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-[180px] h-10 rounded-xl bg-card border-border/50">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/50 bg-card">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      }
    />
  );
}
