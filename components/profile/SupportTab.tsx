"use client";

import { useState, useEffect } from "react";
import {
  MessageCircle,
  Plus, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SupportTab() {
  const [tickets, setTickets] = useState<
    {
      _id: string;
      subject: string;
      description: string;
      priority: string;
      category: string;
      status: string;
      createdAt: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "other",
  });

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/user/tickets");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

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
        setNewTicket({
          subject: "",
          description: "",
          priority: "medium",
          category: "other",
        });
        fetchTickets();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

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

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl gap-2 font-bold shadow-xl shadow-primary/20">
              <Plus className="w-4 h-4" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[32px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">
                Create Support Ticket
              </DialogTitle>
              <DialogDescription>
                Describe your issue and we&apos;ll help you resolve it.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Subject
                </Label>
                <Input
                  placeholder="Brief summary of the issue"
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, subject: e.target.value })
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Category
                  </Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(v) =>
                      setNewTicket({ ...newTicket, category: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Priority
                  </Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(v) =>
                      setNewTicket({ ...newTicket, priority: v })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Description
                </Label>
                <Textarea
                  placeholder="Provide more details..."
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  className="rounded-xl min-h-[120px]"
                />
              </div>
              <Button
                onClick={handleCreateTicket}
                className="w-full rounded-xl h-12 font-bold mt-4"
              >
                Create Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-24 bg-muted animate-pulse rounded-[32px]"
              />
            ))
        ) : (tickets || []).length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-border">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">
              No support tickets found.
            </p>
          </div>
        ) : (
          (tickets || []).map((ticket) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-6 rounded-[32px] bg-card border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform`}
                  >
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{ticket.subject}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        #{ticket._id.substring(ticket._id.length - 6)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {ticket.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                      Status
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
                      {getStatusIcon(ticket.status)}
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Send message">
                    <Send className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
