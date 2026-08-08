"use client";

import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersStats } from "@/components/admin/users/UsersStats";
import { UsersSearch } from "@/components/admin/users/UsersSearch";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { AdminUserDialog } from "@/components/admin/users/AdminUserDialog";
import { useAdminUsers } from "@/modules/admin/hooks/use-admin-users";

export default function UsersPage() {
  const {
    filteredUsers, loading, searchQuery, setSearchQuery, roleFilter, setRoleFilter,
    statusFilter, setStatusFilter, selectedUser, setSelectedUser, isDialogOpen,
    setIsDialogOpen, pagination, fetchUsers, handlePageChange, handleDelete,
    handleChangeRole, handleUpdateStatus, stats, status,
  } = useAdminUsers();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersHeader loading={loading} onRefresh={() => fetchUsers(pagination.page)} />

      <UsersStats stats={stats} />

      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <UsersSearch
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          roleFilter={roleFilter} setRoleFilter={setRoleFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        />

        <UsersTable
          users={filteredUsers} loading={loading}
          onEdit={(user) => { setSelectedUser(user); setIsDialogOpen(true); }}
          onDelete={handleDelete} onChangeRole={handleChangeRole} onUpdateStatus={handleUpdateStatus}
        />

        <div className="p-4 border-t border-border/60">
          <ProfessionalPagination
            currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AdminUserDialog
        open={isDialogOpen} onOpenChange={setIsDialogOpen}
        user={selectedUser} onSuccess={() => fetchUsers(pagination.page)}
      />
    </div>
  );
}
