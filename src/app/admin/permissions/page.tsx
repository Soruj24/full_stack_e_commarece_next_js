"use client";

import { useState, useEffect, useCallback } from "react";
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

  return (
    <div className="space-y-6">
      <PermissionsHeader onRefresh={fetchPermissions} loading={loading} />

      <PermissionsGrid permissions={permissions} loading={loading} />
    </div>
  );
}
