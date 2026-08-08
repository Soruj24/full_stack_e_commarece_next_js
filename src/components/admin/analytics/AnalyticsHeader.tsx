"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export function AnalyticsHeader() {
  return (
    <PageHeader
      title="Analytics Overview"
      description="Real-time performance metrics and business insights."
      action={
        <Button className="gap-2">
          <ArrowUpRight className="w-4 h-4" />
          Export Report
        </Button>
      }
    />
  );
}
