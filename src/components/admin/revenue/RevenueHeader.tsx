"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface RevenueHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function RevenueHeader({ onRefresh, loading }: RevenueHeaderProps) {
  return (
    <PageHeader
      title="Revenue Analytics"
      description="Monitor revenue streams, payment methods, and forecasts."
      action={
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      }
    />
  );
}
