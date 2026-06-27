"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ContactHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function ContactHeader({ loading, onRefresh }: ContactHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer inquiries
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={loading}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
