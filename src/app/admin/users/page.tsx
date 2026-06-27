"use client";

import { UsersHeader } from "@/components/admin/users/UsersHeader";
import { UsersStats } from "@/components/admin/users/UsersStats";
import { UsersSearch } from "@/components/admin/users/UsersSearch";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { AdminUserDialog } from "@/components/admin/users/AdminUserDialog";
import { useAdminUsers } from "@/features/admin/hooks/use-admin-users";

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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <UsersHeader loading={loading} onRefresh={() => fetchUsers(pagination.page)} />

        <UsersStats stats={stats} />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
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

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <AdminUserDialog
        open={isDialogOpen} onOpenChange={setIsDialogOpen}
        user={selectedUser} onSuccess={() => fetchUsers(pagination.page)}
      />
    </div>
  );
}
