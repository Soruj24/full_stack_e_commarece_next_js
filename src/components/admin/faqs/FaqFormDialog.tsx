"use client";

import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FAQ_CATEGORIES, type FaqItem } from "@/modules/support/types/faq";

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

export function FaqFormDialog({
  isOpen,
  onOpenChange,
  editingFaq,
  saving,
  formData,
  onFormChange,
  onSubmit,
  onAddNew,
}: FaqFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={onAddNew} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] rounded-xl bg-card border-border/60 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {editingFaq ? "Edit FAQ" : "Create FAQ"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {editingFaq ? "Update the FAQ details" : "Add a new frequently asked question"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Question
            </Label>
            <Input
              placeholder="Enter the question"
              value={formData.question}
              onChange={(e) => onFormChange({ question: e.target.value })}
              className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Answer
            </Label>
            <Textarea
              placeholder="Enter the answer (HTML supported)"
              value={formData.answer}
              onChange={(e) => onFormChange({ answer: e.target.value })}
              className="min-h-[120px] rounded-lg bg-muted/50 border-border/60 text-sm p-3"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </Label>
              <select
                value={formData.category}
                onChange={(e) => onFormChange({ category: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-border/60 bg-muted/50 text-sm focus:outline-none"
                required
              >
                <option value="">Select category</option>
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Order
              </Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => onFormChange({ order: parseInt(e.target.value) || 0 })}
                className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-lg text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-lg text-sm"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              {editingFaq ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
