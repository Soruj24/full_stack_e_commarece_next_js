"use client";

import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface RolesHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function RolesHeader({ onCreate, onRefresh, loading }: RolesHeaderProps) {
  return (
    <PageHeader
      title="Roles"
      description="Manage user roles and their permissions."
      action={
        <div className="flex items-center gap-3">
          <Button onClick={onCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
          <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      }
    />
  );
}
