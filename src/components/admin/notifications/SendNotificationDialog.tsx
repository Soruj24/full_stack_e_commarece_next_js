"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import type { NotificationTemplate } from "@/modules/admin/types";

interface SendNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SendNotificationDialog({
  open,
  onOpenChange,
  onSuccess,
}: SendNotificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    recipients: "all",
    scheduledFor: "",
  });

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/notifications/templates");
      if (res.ok) {
        const data = await res.json();
        const raw = data.data?.templates || data.templates || [];
        setTemplates(raw);
      }
    } catch {
      // Templates are optional
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId);
    if (template) {
      setFormData((prev) => ({
        ...prev,
        title: template.subject || prev.title,
        message: template.body || prev.message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        recipients: formData.recipients,
      };

      if (formData.scheduledFor) {
        body.scheduledFor = formData.scheduledFor;
      }

      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send notification");
      }

      toast.success("Notification sent successfully!");
      onOpenChange(false);
      setFormData({ title: "", message: "", type: "info", recipients: "all", scheduledFor: "" });
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl bg-card border-border/60 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Send Notification
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Compose a new notification to send to users.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {templates.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Template (Optional)
              </Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border/60 bg-card">
                  {templates.map((template) => (
                    <SelectItem key={template._id} value={template._id} className="text-sm">
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Title
            </Label>
            <Input
              placeholder="Notification title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Message
            </Label>
            <Textarea
              placeholder="Notification message..."
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="min-h-[80px] rounded-lg bg-muted/50 border-border/60 text-sm p-3"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v })}
            >
              <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border/60 bg-card">
                <SelectItem value="info" className="text-sm">Info</SelectItem>
                <SelectItem value="warning" className="text-sm">Warning</SelectItem>
                <SelectItem value="success" className="text-sm">Success</SelectItem>
                <SelectItem value="error" className="text-sm">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Recipients
            </Label>
            <Select
              value={formData.recipients}
              onValueChange={(v) => setFormData({ ...formData, recipients: v })}
            >
              <SelectTrigger className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border/60 bg-card">
                <SelectItem value="all" className="text-sm">All Users</SelectItem>
                <SelectItem value="admin" className="text-sm">All Admins</SelectItem>
                <SelectItem value="user" className="text-sm">Specific Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Schedule (Optional)
            </Label>
            <Input
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
              className="h-9 rounded-lg bg-muted/50 border-border/60 text-sm"
            />
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
              disabled={loading}
              className="rounded-lg text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Send
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
