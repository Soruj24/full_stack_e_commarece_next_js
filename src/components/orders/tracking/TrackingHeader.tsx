"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackingHeaderProps {
  orderId: string;
  lastUpdated: string | null;
  refreshing: boolean;
  onRefresh: () => void;
}

export function TrackingHeader({ orderId, lastUpdated, refreshing, onRefresh }: TrackingHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-2">
            Track Order <span className="text-primary">#{orderId.slice(-8).toUpperCase()}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : "Just now"}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={refreshing}
        className="gap-2"
      >
        <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
        Refresh
      </Button>
    </div>
  );
}

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";