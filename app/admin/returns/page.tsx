"use client";

import { Badge } from "@/components/ui/badge";
import { useAdminReturns } from "@/hooks/use-admin-returns";
import { ReturnStatusCards } from "@/components/admin/returns/ReturnStatusCards";
import { ReturnTable } from "@/components/admin/returns/ReturnTable";
import { ReturnDetailDialog } from "@/components/admin/returns/ReturnDetailDialog";

export default function AdminReturnsPage() {
  const {
    filteredReturns, loading, searchQuery, setSearchQuery, statusFilter, setStatusFilter,
    selectedReturn, setSelectedReturn, detailOpen, setDetailOpen, actionLoading, adminNote, setAdminNote,
    refundAmount, setRefundAmount, handleAction, statusCounts,
  } = useAdminReturns();

  const pendingCount = statusCounts.pending || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground">Manage return requests</p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            {pendingCount} pending requests
          </Badge>
        )}
      </div>

      <ReturnStatusCards statusCounts={statusCounts} activeStatus={statusFilter} onStatusClick={setStatusFilter} />

      <ReturnTable
        returns={filteredReturns} loading={loading}
        searchQuery={searchQuery} statusFilter={statusFilter}
        onSearchChange={setSearchQuery} onStatusFilterChange={setStatusFilter}
        onViewDetail={(ret) => { setSelectedReturn(ret); setDetailOpen(true); }}
      />

      <ReturnDetailDialog
        selectedReturn={selectedReturn} open={detailOpen} onOpenChange={setDetailOpen}
        actionLoading={actionLoading} adminNote={adminNote} refundAmount={refundAmount}
        onNoteChange={setAdminNote} onRefundAmountChange={setRefundAmount} onAction={handleAction}
      />
    </div>
  );
}
