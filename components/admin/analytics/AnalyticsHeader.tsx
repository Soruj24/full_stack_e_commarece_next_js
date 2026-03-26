"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnalyticsHeader() {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Analytics Overview
        </h1>
        <p className="text-muted-foreground">
          Real-time performance metrics and business insights.
        </p>
      </div>
      <Button className="rounded-2xl font-bold gap-2">
        <ArrowUpRight className="w-4 h-4" />
        Export Report
      </Button>
    </div>
  );
}