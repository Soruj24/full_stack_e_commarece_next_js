"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RevenueHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function RevenueHeader({ onRefresh, loading }: RevenueHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Revenue Analytics
        </h1>
        <p className="text-muted-foreground">
          Monitor revenue streams, payment methods, and forecasts.
        </p>
      </div>
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
  );
}
