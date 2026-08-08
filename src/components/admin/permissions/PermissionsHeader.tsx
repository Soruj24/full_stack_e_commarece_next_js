"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface PermissionsHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function PermissionsHeader({ onRefresh, loading }: PermissionsHeaderProps) {
  return (
    <PageHeader
      title="Permissions"
      description="View all system permissions organized by module."
      action={
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      }
    />
  );
}
