"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface UsersHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function UsersHeader({ loading, onRefresh }: UsersHeaderProps) {
  return (
    <PageHeader
      title="Customers"
      description="Manage and monitor all registered users"
      action={
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          className="h-9 w-9 rounded-lg border-border/60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      }
    />
  );
}
