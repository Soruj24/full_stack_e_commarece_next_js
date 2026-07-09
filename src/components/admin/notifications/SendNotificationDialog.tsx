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
        setTemplates(data.templates || []);
      }
    } catch {
      // Silently fail - templates are optional
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

      const data = await res.json();

      if (!res.ok) {
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
      <DialogContent className="sm:max-w-[500px] rounded-[32px] bg-card border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Send className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            Send Notification
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground font-medium">
            Compose a new notification to send to users.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            {templates.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                  Template (Optional)
                </Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-card">
                    {templates.map((template) => (
                      <SelectItem key={template._id} value={template._id} className="font-bold">
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Title
              </Label>
              <Input
                placeholder="Notification title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Message
              </Label>
              <Textarea
                placeholder="Notification message..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[100px] rounded-xl bg-muted/50 border-border focus:ring-primary font-bold p-4"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="info" className="font-bold">Info</SelectItem>
                  <SelectItem value="warning" className="font-bold">Warning</SelectItem>
                  <SelectItem value="success" className="font-bold">Success</SelectItem>
                  <SelectItem value="error" className="font-bold">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Recipients
              </Label>
              <Select
                value={formData.recipients}
                onValueChange={(v) => setFormData({ ...formData, recipients: v })}
              >
                <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="all" className="font-bold">All Users</SelectItem>
                  <SelectItem value="admin" className="font-bold">All Admins</SelectItem>
                  <SelectItem value="user" className="font-bold">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Schedule (Optional)
              </Label>
              <Input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                className="h-12 rounded-xl bg-muted/50 border-border focus:ring-primary font-bold"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-bold px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-2xl font-black px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
