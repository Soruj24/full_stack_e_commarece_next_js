"use client";

import { Lock } from "lucide-react";
import type { AdminPermission } from "@/modules/admin/types";

interface PermissionsGridProps {
  permissions: AdminPermission[] | null | undefined;
  loading: boolean;
}

export function PermissionsGrid({ permissions, loading }: PermissionsGridProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
        <p className="text-muted-foreground mt-4">Loading permissions...</p>
      </div>
    );
  }

  const list = Array.isArray(permissions) ? permissions : [];

  if (list.length === 0) {
    return (
      <div className="bg-card border border-border/60 rounded-xl p-12 text-center">
        <p className="text-muted-foreground">No permissions found</p>
      </div>
    );
  }

  const groupedPermissions = list.reduce((acc, permission) => {
    const module = permission.module || "Other";
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, AdminPermission[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedPermissions).map(([module, perms]) => (
        <div
          key={module}
          className="bg-card p-6 rounded-xl border border-border/60"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">{module}</h3>
          </div>
          <div className="space-y-2">
            {perms.map((permission) => (
              <div
                key={permission._id}
                className="p-3 rounded-lg bg-muted/30 border border-border/60"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{permission.name}</span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {permission.key}
                  </span>
                </div>
                {permission.description && (
                  <p className="text-xs text-muted-foreground">
                    {permission.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
