import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ContactMessage } from '@/lib/types';

export function useAdminContact() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?page=${page}&limit=${pagination.limit}&status=${statusFilter}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        setPagination(prev => ({ ...prev, page, total: data.length, pages: Math.ceil(data.length / pagination.limit) }));
      }
    } catch { toast.error("Failed to fetch messages"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") redirect("/login");
    fetchMessages();
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => fetchMessages(1), 500);
    return () => clearTimeout(timer);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => fetchMessages(newPage);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Message deleted"); fetchMessages(pagination.page); }
    } catch { toast.error("Failed to delete message"); }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { toast.success("Status updated"); fetchMessages(pagination.page); }
    } catch { toast.error("Failed to update status"); }
  };

  const filteredMessages = messages.filter((msg) => statusFilter === "all" || msg.status === statusFilter);
  const stats = {
    total: messages.length,
    pending: messages.filter((m) => m.status === "pending").length,
    read: messages.filter((m) => m.status === "read").length,
    replied: messages.filter((m) => m.status === "replied").length,
  };

  return { messages, filteredMessages, loading, statusFilter, setStatusFilter, selectedMessage, setSelectedMessage, isDialogOpen, setIsDialogOpen, pagination, fetchMessages, handlePageChange, handleDelete, handleUpdateStatus, stats, status };
}
