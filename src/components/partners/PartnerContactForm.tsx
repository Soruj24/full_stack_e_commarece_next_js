"use client";

import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { partnershipTypes } from "@/lib/data/partners";

interface Props {
  show: boolean;
  onClose: () => void;
  formData: {
    companyName: string; contactName: string; email: string; phone: string;
    website: string; partnershipType: string; message: string;
  };
  onUpdate: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export function PartnerContactForm({ show, onClose, formData, onUpdate, onSubmit, submitting }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Become a Partner</h2>
            <p className="text-sm text-muted-foreground">Fill out the form below and we&apos;ll get back to you within 48 hours.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" value={formData.companyName} onChange={(e) => onUpdate("companyName", e.target.value)} placeholder="Acme Inc." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input id="contactName" value={formData.contactName} onChange={(e) => onUpdate("contactName", e.target.value)} placeholder="John Doe" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => onUpdate("email", e.target.value)} placeholder="john@acme.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => onUpdate("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={formData.website} onChange={(e) => onUpdate("website", e.target.value)} placeholder="https://acme.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnershipType">Partnership Type *</Label>
              <select id="partnershipType" value={formData.partnershipType} onChange={(e) => onUpdate("partnershipType", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                <option value="">Select type...</option>
                {partnershipTypes.map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={formData.message} onChange={(e) => onUpdate("message", e.target.value)} placeholder="Tell us about your company and partnership goals..." rows={4} />
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> Submit Application</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
