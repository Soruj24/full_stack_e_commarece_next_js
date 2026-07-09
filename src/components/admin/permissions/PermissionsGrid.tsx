"use client";

import { Lock } from "lucide-react";
import type { AdminPermission } from "@/modules/admin/types";

interface PermissionsGridProps {
  permissions: AdminPermission[];
  loading: boolean;
}

export function PermissionsGrid({ permissions, loading }: PermissionsGridProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading permissions...</p>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <p className="text-muted-foreground">No permissions found</p>
      </div>
    );
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
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
          className="bg-card p-6 rounded-[32px] border border-border/50 shadow-xl shadow-primary/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-black tracking-tight">{module}</h3>
          </div>
          <div className="space-y-3">
            {perms.map((permission) => (
              <div
                key={permission._id}
                className="p-4 rounded-2xl bg-muted/30 border border-border/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{permission.name}</span>
                  <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-lg">
                    {permission.key}
                  </span>
                </div>
                {permission.description && (
                  <p className="text-xs text-muted-foreground mt-1">
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
