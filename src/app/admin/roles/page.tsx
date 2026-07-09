"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RolesHeader,
  RolesList,
  RoleFormDialog,
} from "@/components/admin/roles";
import type { AdminRole, AdminPermission } from "@/modules/admin/types";

export default function AdminRolesPage() {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        fetch("/api/admin/roles"),
        fetch("/api/admin/permissions"),
      ]);

      const rolesJson = await rolesRes.json();
      const permsJson = await permsRes.json();

      if (!rolesRes.ok) throw new Error(rolesJson.error || "Failed to fetch roles");
      if (!permsRes.ok) throw new Error(permsJson.error || "Failed to fetch permissions");

      setRoles(rolesJson.roles || rolesJson.data || []);
      setPermissions(permsJson.permissions || permsJson.data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/roles/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete role");
      toast.success("Role deleted successfully");
      fetchData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete role");
      }
    }
  }, [fetchData]);

  const handleCreate = useCallback(() => {
    setSelectedRole(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((role: AdminRole) => {
    setSelectedRole(role);
    setDialogOpen(true);
  }, []);

  if (loading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <RolesHeader
        onCreate={handleCreate}
        onRefresh={fetchData}
        loading={loading}
      />

      <RolesList
        roles={roles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <RoleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
        permissions={permissions}
        onSuccess={fetchData}
      />
    </div>
  );
}
