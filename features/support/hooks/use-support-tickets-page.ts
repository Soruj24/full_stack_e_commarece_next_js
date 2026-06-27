import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Ticket {
  _id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  messages: { sender: string; message: string; createdAt: string }[];
}

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-red-100 text-red-700" },
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-700" },
};

export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-600" },
  high: { label: "High", color: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-600" },
};

export function useSupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: "", category: "", message: "", email: "", name: "" });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch { toast.error("Failed to load tickets"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/tickets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Ticket submitted! We'll respond soon.");
      setIsCreateOpen(false);
      setFormData({ subject: "", category: "", message: "", email: "", name: "" });
      fetchTickets();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to submit"); }
    finally { setSubmitting(false); }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return { tickets, loading, isCreateOpen, setIsCreateOpen, submitting, formData, setFormData, handleSubmit, formatDate };
}
