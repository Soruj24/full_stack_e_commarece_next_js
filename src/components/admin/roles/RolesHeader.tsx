"use client";

import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RolesHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function RolesHeader({ onCreate, onRefresh, loading }: RolesHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Roles
        </h1>
        <p className="text-muted-foreground">
          Manage user roles and their permissions.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onCreate} className="rounded-2xl font-bold gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-2xl"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
