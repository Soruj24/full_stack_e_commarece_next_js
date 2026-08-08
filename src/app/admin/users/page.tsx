"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  CustomersStats,
  CustomersFilters,
  CustomersTable,
  CustomersPagination,
  CustomersEmptyState,
  CustomersErrorState,
  useCustomersManager,
} from "@/components/admin/customers";

export default function CustomersPage() {
  const {
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
    refresh,
  } = useCustomersManager();

  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    handleFilterChange("search", "");
    handleFilterChange("role", "all");
    handleFilterChange("status", "all");
    handleFilterChange("dateFrom", "");
    handleFilterChange("dateTo", "");
    setResetKey((k) => k + 1);
  };

  const hasActiveFilters =
    !!filters.search ||
    filters.role !== "all" ||
    filters.status !== "all" ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage registered users, roles, and account status"
      />

      <CustomersStats stats={stats} />

      <div className="border border-border/60 rounded-xl bg-card overflow-hidden">
        <div className="p-4">
          <CustomersFilters
            key={resetKey}
            filters={filters}
            totalUsers={users.length}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {error ? (
          <CustomersErrorState error={error} onRetry={refresh} />
        ) : !loading && users.length === 0 ? (
          <CustomersEmptyState hasFilters={hasActiveFilters} onReset={handleReset} />
        ) : (
          <CustomersTable
            users={users}
            loading={loading}
            sort={sort}
            onSort={handleSortChange}
            onDelete={handleDelete}
            onChangeRole={handleChangeRole}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {!error && !loading && users.length > 0 && (
          <CustomersPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
