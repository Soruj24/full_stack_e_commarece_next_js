"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Shield } from "lucide-react";
import type { AdminRole } from "@/modules/admin/types";

interface RolesListProps {
  roles: AdminRole[];
  onEdit: (role: AdminRole) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export function RolesList({ roles, onEdit, onDelete, loading }: RolesListProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading roles...</p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-[48px] p-12 text-center">
        <p className="text-muted-foreground">No roles found</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>System</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-bold">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[250px] truncate">
                  {role.description}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {role.permissions?.length || 0} permissions
                  </Badge>
                </TableCell>
                <TableCell className="font-bold">{role.userCount || 0}</TableCell>
                <TableCell>
                  {role.isSystem ? (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                      System
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Custom
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => onEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-destructive hover:text-destructive"
                      onClick={() => onDelete(role._id)}
                      disabled={role.isSystem}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
