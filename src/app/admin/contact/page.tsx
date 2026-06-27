"use client";

import { ContactHeader } from "@/components/admin/contact/ContactHeader";
import { ContactStats } from "@/components/admin/contact/ContactStats";
import { ContactTable } from "@/components/admin/contact/ContactTable";
import { AdminContactDialog } from "@/components/admin/contact/AdminContactDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import { useAdminContact } from "@/features/admin/hooks/use-admin-contact";

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
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <ContactHeader loading={loading} onRefresh={() => fetchMessages(pagination.page)} />

        <ContactStats stats={stats} />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>
          </div>

          <ContactTable
            messages={filteredMessages} loading={loading}
            onView={(msg) => { setSelectedMessage(msg); setIsDialogOpen(true); handleUpdateStatus(msg._id, "read"); }}
            onDelete={handleDelete} onUpdateStatus={handleUpdateStatus}
          />

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <AdminContactDialog
        open={isDialogOpen} onOpenChange={setIsDialogOpen}
        message={selectedMessage} onReply={handleUpdateStatus}
      />
    </div>
  );
}
