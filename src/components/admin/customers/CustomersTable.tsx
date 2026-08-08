"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";
import type { User } from "@/shared/types";
import type { CustomerSortField, CustomerSortDirection } from "./useCustomersManager";
import { cn } from "@/lib/utils";

interface CustomersTableProps {
  users: User[];
  loading: boolean;
  sort: { field: CustomerSortField; direction: CustomerSortDirection };
  onSort: (field: CustomerSortField) => void;
  onDelete: (userId: string) => void;
  onChangeRole: (userId: string, role: string) => void;
  onUpdateStatus: (userId: string, status: string) => void;
}

function SortHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string;
  field: CustomerSortField;
  currentSort: { field: CustomerSortField; direction: CustomerSortDirection };
  onSort: (field: CustomerSortField) => void;
}) {
  const isActive = currentSort.field === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
    >
      {label}
      {isActive ? (
        currentSort.direction === "asc" ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : null}
    </button>
  );
}

function getRoleVariant(role: string): "info" | "warning" | "default" | "muted" {
  switch (role) {
    case "admin":
      return "info";
    case "vendor":
      return "warning";
    default:
      return "default";
  }
}

function getStatusVariant(status: string): "success" | "danger" | "muted" {
  switch (status) {
    case "active":
      return "success";
    case "banned":
      return "danger";
    default:
      return "muted";
  }
}

function CustomerRow({
  user,
  onDelete,
  onChangeRole,
  onUpdateStatus,
}: {
  user: User;
  onDelete: (userId: string) => void;
  onChangeRole: (userId: string, role: string) => void;
  onUpdateStatus: (userId: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const userId = user._id || user.id || "";

  return (
    <tr className="border-b border-border/60 hover:bg-muted/30 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            {user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              {user.twoFactorEnabled && (
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded font-medium">
                  2FA
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <StatusBadge variant={getRoleVariant(user.role)}>
          {user.role}
        </StatusBadge>
      </td>

      <td className="px-4 py-3">
        <StatusBadge variant={getStatusVariant(user.status)} dot>
          {user.status}
        </StatusBadge>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {user.isVerified ? (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/30" />
          )}
          <span className="text-xs text-muted-foreground">
            {user.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-xs text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </td>

      <td className="px-4 py-3">
        <span className="text-xs text-muted-foreground">
          {user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Never"}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/customers/${userId}`}
            className="h-7 w-7 inline-flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setOpen(!open)}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-border/60 bg-card shadow-lg py-1">
                  <Link
                    href={`/admin/customers/${userId}`}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Profile
                  </Link>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                    onClick={() => {
                      onChangeRole(userId, user.role === "admin" ? "user" : "admin");
                      setOpen(false);
                    }}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                  </button>
                  {user.status === "active" ? (
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                      onClick={() => {
                        onUpdateStatus(userId, "banned");
                        setOpen(false);
                      }}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Ban User
                    </button>
                  ) : (
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 flex items-center gap-2"
                      onClick={() => {
                        onUpdateStatus(userId, "active");
                        setOpen(false);
                      }}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Unban User
                    </button>
                  )}
                  <div className="border-t border-border/60 my-1" />
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                    onClick={() => {
                      onDelete(userId);
                      setOpen(false);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete User
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/60 animate-pulse">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted/50" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 bg-muted/50 rounded" />
                <div className="h-3 w-36 bg-muted/30 rounded" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-14 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-5 w-14 bg-muted/50 rounded-full" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 bg-muted/50 rounded" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
              <div className="h-7 w-7 bg-muted/50 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function CustomersTable({
  users,
  loading,
  sort,
  onSort,
  onDelete,
  onChangeRole,
  onUpdateStatus,
}: CustomersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="sticky top-0 z-10 bg-card border-b border-border/60">
          <tr>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Customer" field="name" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Verified
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Joined" field="createdAt" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Last Login" field="lastLogin" currentSort={sort} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-right">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {loading ? (
            <TableSkeleton />
          ) : users.length === 0 ? null : (
            users.map((user) => (
              <CustomerRow
                key={user._id || user.id}
                user={user}
                onDelete={onDelete}
                onChangeRole={onChangeRole}
                onUpdateStatus={onUpdateStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
