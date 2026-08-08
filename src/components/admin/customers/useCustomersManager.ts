"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { User } from "@/shared/types";

export type CustomerSortField = "name" | "email" | "createdAt" | "lastLogin";
export type CustomerSortDirection = "asc" | "desc";

export interface CustomerFilters {
  search: string;
  role: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export function useCustomersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    role: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [sort, setSort] = useState<{ field: CustomerSortField; direction: CustomerSortDirection }>({
    field: "createdAt",
    direction: "desc",
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(async (page = 1) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pagination.limit));

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();

      if (data.success) {
        let filteredUsers = data.users || [];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          filteredUsers = filteredUsers.filter(
            (u: User) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q)
          );
        }

        if (filters.role !== "all") {
          filteredUsers = filteredUsers.filter((u: User) => u.role === filters.role);
        }

        if (filters.status !== "all") {
          filteredUsers = filteredUsers.filter((u: User) => u.status === filters.status);
        }

        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom);
          filteredUsers = filteredUsers.filter(
            (u: User) => new Date(u.createdAt) >= from
          );
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo);
          to.setHours(23, 59, 59, 999);
          filteredUsers = filteredUsers.filter(
            (u: User) => new Date(u.createdAt) <= to
          );
        }

        filteredUsers.sort((a: User, b: User) => {
          let aVal: number | string;
          let bVal: number | string;

          switch (sort.field) {
            case "name":
              aVal = a.name;
              bVal = b.name;
              break;
            case "email":
              aVal = a.email;
              bVal = b.email;
              break;
            case "lastLogin":
              aVal = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
              bVal = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
              break;
            default:
              aVal = new Date(a.createdAt).getTime();
              bVal = new Date(b.createdAt).getTime();
          }

          if (sort.direction === "asc") {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          }
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        });

        setUsers(filteredUsers);
        setPagination((prev) => ({
          ...prev,
          page: data.pagination?.page || 1,
          total: data.pagination?.total || 0,
          pages: data.pagination?.pages || 0,
        }));
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.limit]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchUsers(1);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters, sort, fetchUsers]);

  const handlePageChange = useCallback((page: number) => {
    fetchUsers(page);
  }, [fetchUsers]);

  const handleFilterChange = useCallback((key: keyof CustomerFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSortChange = useCallback((field: CustomerSortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  }, []);

  const handleDelete = useCallback(async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers(pagination.page);
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    }
  }, [pagination.page, fetchUsers]);

  const handleChangeRole = useCallback(async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        toast.success("Role updated");
        fetchUsers(pagination.page);
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("Failed to update role");
    }
  }, [pagination.page, fetchUsers]);

  const handleUpdateStatus = useCallback(async (userId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`User ${newStatus}`);
        fetchUsers(pagination.page);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  }, [pagination.page, fetchUsers]);

  const stats = {
    total: pagination.total,
    admins: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => u.status === "active").length,
    banned: users.filter((u) => u.status === "banned").length,
    verified: users.filter((u) => u.isVerified).length,
    with2FA: users.filter((u) => u.twoFactorEnabled).length,
  };

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    sort,
    stats,
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    handleDelete,
    handleChangeRole,
    handleUpdateStatus,
    refresh: () => fetchUsers(pagination.page),
  };
}
