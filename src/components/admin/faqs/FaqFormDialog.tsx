"use client";

import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FAQ_CATEGORIES, type FaqItem } from "@/features/support/types/faq";

interface FaqFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingFaq: FaqItem | null;
  saving: boolean;
  formData: { question: string; answer: string; category: string; order: number; isPublished: boolean };
  onFormChange: (data: Partial<{ question: string; answer: string; category: string; order: number; isPublished: boolean }>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAddNew: () => void;
}

export function FaqFormDialog({ isOpen, onOpenChange, editingFaq, saving, formData, onFormChange, onSubmit, onAddNew }: FaqFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onAddNew}><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingFaq ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
          <DialogDescription>{editingFaq ? "Update the FAQ details" : "Add a new frequently asked question"}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" placeholder="Enter the question" value={formData.question}
              onChange={(e) => onFormChange({ question: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" placeholder="Enter the answer (HTML supported)" value={formData.answer}
              onChange={(e) => onFormChange({ answer: e.target.value })} className="min-h-[150px]" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={formData.category}
                onChange={(e) => onFormChange({ category: e.target.value })}
                className="w-full h-10 px-3 rounded-md border bg-background" required>
                <option value="">Select category</option>
                {FAQ_CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" value={formData.order}
                onChange={(e) => onFormChange({ order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingFaq ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
