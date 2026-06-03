"use client";

import { User, Mail, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GiftCardFormData {
  amount: number;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

interface GiftCardRecipientFormProps {
  formData: GiftCardFormData;
  onInputChange: (field: keyof GiftCardFormData, value: string) => void;
}

export function GiftCardRecipientForm({ formData, onInputChange }: GiftCardRecipientFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient-name">Recipient Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input id="recipient-name" placeholder="Jane Smith" value={formData.recipientName}
            onChange={(e) => onInputChange("recipientName", e.target.value)} className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="recipient-email">Recipient Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input id="recipient-email" type="email" placeholder="jane@example.com" value={formData.recipientEmail}
            onChange={(e) => onInputChange("recipientEmail", e.target.value)} className="pl-10" />
        </div>
      </div>
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium mb-3">Your Details</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sender-name">Your Name *</Label>
            <Input id="sender-name" placeholder="John Doe" value={formData.senderName}
              onChange={(e) => onInputChange("senderName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-email">Your Email *</Label>
            <Input id="sender-email" type="email" placeholder="john@example.com" value={formData.senderEmail}
              onChange={(e) => onInputChange("senderEmail", e.target.value)} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Personal Message (optional)</Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <textarea id="message" placeholder="Add a personal message..." value={formData.message}
            onChange={(e) => onInputChange("message", e.target.value)}
            className="w-full min-h-[100px] px-10 py-3 rounded-lg border bg-background resize-none" maxLength={500} />
        </div>
        <p className="text-xs text-muted-foreground text-right">{formData.message.length}/500</p>
      </div>
    </div>
  );
}
