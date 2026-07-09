import type { AdminRole, AdminPermission } from "@/modules/admin/types/analytics";

interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

export async function fetchRoles(): Promise<AdminRole[]> {
  try {
    const res = await fetch("/api/admin/roles");
    const data = await res.json();
    if (data.success && Array.isArray(data.roles)) return data.roles;
    return [];
  } catch {
    return [];
  }
}

export async function createRole(data: RoleFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function updateRole(id: string, data: Partial<RoleFormData>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/roles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    return await res.json();
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function deleteRole(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/roles?id=${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchPermissions(): Promise<AdminPermission[]> {
  try {
    const res = await fetch("/api/admin/permissions");
    const data = await res.json();
    if (data.success && Array.isArray(data.permissions)) return data.permissions;
    return [];
  } catch {
    return [];
  }
}
