"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import type { NewTicketData } from "@/features/support/types/support-ticket";

interface TicketFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: NewTicketData;
  onChange: (data: NewTicketData) => void;
  onSubmit: () => void;
}

export function TicketForm({ isOpen, onOpenChange, data, onChange, onSubmit }: TicketFormProps) {
  const update = (partial: Partial<NewTicketData>) => onChange({ ...data, ...partial });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl gap-2 font-bold shadow-xl shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight">Create Support Ticket</DialogTitle>
          <DialogDescription>Describe your issue and we&apos;ll help you resolve it.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
            <Input placeholder="Brief summary of the issue" value={data.subject}
              onChange={(e) => update({ subject: e.target.value })} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
              <Select value={data.category} onValueChange={(v) => update({ category: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
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
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Priority</Label>
              <Select value={data.priority} onValueChange={(v) => update({ priority: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
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
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
            <Textarea placeholder="Provide more details..." value={data.description}
              onChange={(e) => update({ description: e.target.value })}
              className="rounded-xl min-h-[120px]" />
          </div>
          <Button onClick={onSubmit} className="w-full rounded-xl h-12 font-bold mt-4">Create Ticket</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
