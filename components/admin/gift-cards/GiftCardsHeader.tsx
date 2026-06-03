"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface GiftCardForm {
  amount: string; senderName: string; senderEmail: string;
  recipientName: string; recipientEmail: string; message: string;
}

interface Props {
  isCreateOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creating: boolean;
  formData: GiftCardForm;
  onFormChange: (data: GiftCardForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function GiftCardsHeader({ isCreateOpen, onOpenChange, creating, formData, onFormChange, onSubmit }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Gift Cards</h1>
        <p className="text-muted-foreground">Manage digital gift cards</p>
      </div>
      <Dialog open={isCreateOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button><Plus className="w-4 h-4 mr-2" />Create Gift Card</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Gift Card</DialogTitle>
            <DialogDescription>Create a new digital gift card. The code will be auto-generated.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input id="amount" type="number" min="1" placeholder="50.00" value={formData.amount}
                  onChange={(e) => onFormChange({ ...formData, amount: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" value="USD" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderName">Sender Name *</Label>
              <Input id="senderName" placeholder="John Doe" value={formData.senderName}
                onChange={(e) => onFormChange({ ...formData, senderName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Sender Email *</Label>
              <Input id="senderEmail" type="email" placeholder="john@example.com" value={formData.senderEmail}
                onChange={(e) => onFormChange({ ...formData, senderEmail: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input id="recipientName" placeholder="Jane Smith" value={formData.recipientName}
                  onChange={(e) => onFormChange({ ...formData, recipientName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Recipient Email</Label>
                <Input id="recipientEmail" type="email" placeholder="jane@example.com" value={formData.recipientEmail}
                  onChange={(e) => onFormChange({ ...formData, recipientEmail: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea id="message" placeholder="Add a personal message..." className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background"
                value={formData.message} onChange={(e) => onFormChange({ ...formData, message: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={creating}>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
