"use client";

import { Megaphone } from "lucide-react";

interface BannersEmptyStateProps {
  show: boolean;
}

export function BannersEmptyState({ show }: BannersEmptyStateProps) {
  if (!show) return null;

  return (
    <div className="col-span-full py-20 text-center space-y-4">
      <div className="inline-flex p-6 rounded-full bg-muted/50 text-muted-foreground">
        <Megaphone className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-black">No banners found</h3>
      <p className="text-muted-foreground">
        Create your first marketing banner to get started.
      </p>
    </div>
  );
}