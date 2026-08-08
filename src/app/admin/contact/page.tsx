"use client";

import { ContactHeader } from "@/components/admin/contact/ContactHeader";
import { ContactStats } from "@/components/admin/contact/ContactStats";
import { ContactTable } from "@/components/admin/contact/ContactTable";
import { AdminContactDialog } from "@/components/admin/contact/AdminContactDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { useAdminContact } from "@/modules/admin/hooks/use-admin-contact";

export default function ContactPage() {
  const {
    filteredMessages, loading, statusFilter, setStatusFilter,
    selectedMessage, setSelectedMessage, isDialogOpen, setIsDialogOpen,
    pagination, fetchMessages, handlePageChange, handleDelete,
    handleUpdateStatus, stats, status,
  } = useAdminContact();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <ContactHeader loading={loading} onRefresh={() => fetchMessages(pagination.page)} />

        <ContactStats stats={stats} />

        <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border/60">
            <select
              className="h-9 px-3 rounded-lg border border-border/60 bg-muted/50 text-sm focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
            </select>
          </div>

          <ContactTable
            messages={filteredMessages} loading={loading}
            onView={(msg) => { setSelectedMessage(msg); setIsDialogOpen(true); handleUpdateStatus(msg._id, "read"); }}
            onDelete={handleDelete} onUpdateStatus={handleUpdateStatus}
          />

          <div className="p-4 border-t border-border/60">
            <ProfessionalPagination
              currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
            />
          </div>
        </div>

      <AdminContactDialog
        open={isDialogOpen} onOpenChange={setIsDialogOpen}
        message={selectedMessage} onReply={handleUpdateStatus}
      />
    </div>
  );
}
