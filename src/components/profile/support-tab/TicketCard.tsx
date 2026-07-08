"use client";

import { motion } from "framer-motion";
import { MessageCircle, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportTicket } from "@/modules/support/types/support-ticket";

function getStatusIcon(status: string) {
  switch (status) {
    case "resolved": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "in-progress": return <Clock className="w-4 h-4 text-blue-500" />;
    default: return <AlertCircle className="w-4 h-4 text-orange-500" />;
  }
}

interface TicketCardProps {
  ticket: SupportTicket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group p-6 rounded-[32px] bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">{ticket.subject}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                #{ticket._id.substring(ticket._id.length - 6)}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{ticket.category}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Status</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
              {getStatusIcon(ticket.status)}
              <span className="text-[10px] font-bold uppercase tracking-wider">{ticket.status}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Send message">
            <Send className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
