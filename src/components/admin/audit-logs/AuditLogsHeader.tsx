"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface AuditLogsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function AuditLogsHeader({ loading, onRefresh }: AuditLogsHeaderProps) {
  return (
    <PageHeader
      title="Audit Logs"
      description="Track all administrative actions"
      action={
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      }
    />
  );
}
