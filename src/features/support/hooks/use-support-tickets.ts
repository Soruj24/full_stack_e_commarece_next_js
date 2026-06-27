import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { SupportTicket, NewTicketData } from "@/features/support/types/support-ticket";

const INITIAL_TICKET: NewTicketData = {
  subject: "",
  description: "",
  priority: "medium",
  category: "other",
};

export function useSupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<NewTicketData>(INITIAL_TICKET);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/user/tickets");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Support ticket created!");
        setIsCreateOpen(false);
        setNewTicket(INITIAL_TICKET);
        fetchTickets();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to create ticket");
    }
  };

  return { tickets, loading, isCreateOpen, setIsCreateOpen, newTicket, setNewTicket, handleCreateTicket };
}
