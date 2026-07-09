"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PermissionsHeader,
  PermissionsGrid,
} from "@/components/admin/permissions";
import type { AdminPermission } from "@/modules/admin/types";

export default function AdminPermissionsPage() {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/permissions");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch permissions");
      setPermissions(json.permissions || json.data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch permissions");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  if (loading && permissions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <PermissionsHeader onRefresh={fetchPermissions} loading={loading} />

      <PermissionsGrid permissions={permissions} loading={loading} />
    </div>
  );
}
