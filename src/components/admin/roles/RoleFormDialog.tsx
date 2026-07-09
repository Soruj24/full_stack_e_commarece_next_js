"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import type { AdminRole, AdminPermission } from "@/modules/admin/types";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: AdminRole | null;
  permissions: AdminPermission[];
  onSuccess: () => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSuccess,
}: RoleFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissionIds: [] as string[],
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: role?.name || "",
        description: role?.description || "",
        permissionIds: role?.permissions || [],
      });
    }
  }, [open, role]);

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module || "Other";
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, AdminPermission[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = role ? "PUT" : "POST";
      const url = role ? `/api/admin/roles/${role._id}` : "/api/admin/roles";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save role");
      }

      toast.success(role ? "Role updated successfully!" : "Role created successfully!");
      onOpenChange(false);
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px] bg-card border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            {role ? "Edit" : "Create"} Role
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground font-medium">
            {role ? "Update the role details and permissions." : "Define a new role with specific permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Role Name
              </Label>
              <Input
                placeholder="e.g., Editor"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Description
              </Label>
              <Textarea
                placeholder="Describe the role's purpose..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[80px] rounded-xl bg-muted/50 border-border focus:ring-primary font-bold p-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Permissions
              </Label>
              <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {module}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map((permission) => (
                        <label
                          key={permission._id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            formData.permissionIds.includes(permission._id)
                              ? "border-primary/50 bg-primary/5"
                              : "border-border/50 hover:border-muted-foreground/20"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissionIds.includes(permission._id)}
                            onChange={() => togglePermission(permission._id)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{permission.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {permission.key}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {permissions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No permissions available
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-bold px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-2xl font-black px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : role ? (
                "Update Role"
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
