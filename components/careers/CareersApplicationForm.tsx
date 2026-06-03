"use client";

import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Job } from "@/lib/data/careers";

interface Props {
  job: Job;
  form: {
    name: string; email: string; phone: string;
    linkedin: string; portfolio: string;
    coverLetter: string; resume: File | null;
  };
  submitting: boolean;
  onFormChange: (form: Props["form"]) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CareersApplicationForm({ job, form, submitting, onFormChange, onClose, onSubmit }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
            <p className="text-sm text-muted-foreground">{job.location} &bull; {job.department}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => onFormChange({ ...form, email: e.target.value })} placeholder="john@example.com" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={form.phone} onChange={(e) => onFormChange({ ...form, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" value={form.linkedin} onChange={(e) => onFormChange({ ...form, linkedin: e.target.value })} placeholder="linkedin.com/in/johndoe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <Input id="portfolio" value={form.portfolio} onChange={(e) => onFormChange({ ...form, portfolio: e.target.value })} placeholder="yourportfolio.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume *</Label>
            <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => onFormChange({ ...form, resume: e.target.files?.[0] || null })} required />
            <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX format</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea id="coverLetter" value={form.coverLetter} onChange={(e) => onFormChange({ ...form, coverLetter: e.target.value })} placeholder="Tell us why you'd be a great fit..." rows={5} />
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
