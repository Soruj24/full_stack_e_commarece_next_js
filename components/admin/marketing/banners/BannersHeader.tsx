"use client";

import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BannersHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddBanner: () => void;
}

export function BannersHeader({ loading, onRefresh, onAddBanner }: BannersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">
          Banner <span className="text-primary">Management</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Manage promotional banners, announcements, and hero images.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="rounded-2xl font-bold border-border/50 gap-2"
          onClick={onRefresh}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />{" "}
          Refresh
        </Button>
        <Button
          onClick={onAddBanner}
          className="rounded-2xl font-black shadow-xl shadow-primary/20 gap-2"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>
    </div>
  );
}