import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import type { User } from "@/shared/types";

export function useAdminUsers() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=${pagination.limit}&search=${searchQuery}&role=${roleFilter}&status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(prev => ({ ...prev, page: data.pagination?.page || 1, total: data.pagination?.total || 0, pages: data.pagination?.pages || 0 }));
      }
    } catch { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") redirect("/login");
    fetchUsers();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter, statusFilter]);

  const handlePageChange = (newPage: number) => fetchUsers(newPage);

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
      if (res.ok) { toast.success("User deleted"); fetchUsers(pagination.page); }
    } catch { toast.error("Failed to delete user"); }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role: newRole }) });
      if (res.ok) { toast.success("Role updated"); fetchUsers(pagination.page); }
    } catch { toast.error("Failed to update role"); }
  };

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, status: newStatus }) });
      if (res.ok) { toast.success(`User ${newStatus}`); fetchUsers(pagination.page); }
    } catch { toast.error("Failed to update status"); }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (roleFilter === "all" || user.role === roleFilter) && (statusFilter === "all" || user.status === statusFilter);
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    active: users.filter((u) => u.status === "active").length,
    banned: users.filter((u) => u.status === "banned").length,
  };

  return { users, filteredUsers, loading, searchQuery, setSearchQuery, roleFilter, setRoleFilter, statusFilter, setStatusFilter, selectedUser, setSelectedUser, isDialogOpen, setIsDialogOpen, pagination, fetchUsers, handlePageChange, handleDelete, handleChangeRole, handleUpdateStatus, stats, status };
}
