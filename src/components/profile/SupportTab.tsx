"use client";

import { useSupportTickets } from "@/features/support/hooks/use-support-tickets";
import { TicketForm } from "./support-tab/TicketForm";
import { TicketCard } from "./support-tab/TicketCard";
import { TicketEmptyState } from "./support-tab/TicketEmptyState";
import { TicketSkeleton } from "./support-tab/TicketSkeleton";

export function SupportTab() {
  const { tickets, loading, isCreateOpen, setIsCreateOpen, newTicket, setNewTicket, handleCreateTicket } = useSupportTickets();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tighter">
            Support <span className="text-primary">Tickets</span>
          </h3>
          <p className="text-muted-foreground font-medium">
            Need help? Create a ticket and we&apos;ll get back to you.
          </p>
        </div>
        <TicketForm
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          data={newTicket}
          onChange={setNewTicket}
          onSubmit={handleCreateTicket}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <TicketSkeleton />
        ) : (tickets || []).length === 0 ? (
          <TicketEmptyState />
        ) : (
          (tickets || []).map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))
        )}
      </div>
    </div>
  );
}
