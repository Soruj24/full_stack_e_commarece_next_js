"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ContactMessage } from "@/types";
import { ContactHeader } from "@/components/admin/contact/ContactHeader";
import { ContactStats } from "@/components/admin/contact/ContactStats";
import { ContactTable } from "@/components/admin/contact/ContactTable";
import { AdminContactDialog } from "@/components/admin/contact/AdminContactDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";

export default function ContactPage() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?page=${page}&limit=${pagination.limit}&status=${statusFilter}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        setPagination((prev) => ({
          ...prev,
          page,
          total: data.length,
          pages: Math.ceil(data.length / pagination.limit),
        }));
      }
    } catch {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      redirect("/login");
    }
    fetchMessages();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchMessages(newPage);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted");
        fetchMessages(pagination.page);
      }
    } catch {
      toast.error("Failed to delete message");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchMessages(pagination.page);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    return matchesStatus;
  });

  const stats = {
    total: messages.length,
    pending: messages.filter((m) => m.status === "pending").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };

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
        <ContactHeader
          loading={loading}
          onRefresh={() => fetchMessages(pagination.page)}
        />

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
            messages={filteredMessages}
            loading={loading}
            onView={(msg) => {
              setSelectedMessage(msg);
              setIsDialogOpen(true);
              handleUpdateStatus(msg._id, "read");
            }}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <AdminContactDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        message={selectedMessage}
        onReply={handleUpdateStatus}
      />
    </div>
  );
}
