"use client";

import { ContactMessage } from "@/shared/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Calendar } from "lucide-react";

interface AdminContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ContactMessage | null;
  onReply: (id: string, status: string) => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "read": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "replied": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default: return "bg-muted text-muted-foreground border-border/60";
  }
}

export function AdminContactDialog({
  open,
  onOpenChange,
  message,
  onReply,
}: AdminContactDialogProps) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl bg-card border-border/60">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Message Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            From {message.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">{message.email}</span>
            </div>
            <Badge variant="outline" className={`text-[11px] font-medium ${getStatusBadge(message.status)}`}>
              {message.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(message.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="pt-1">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Subject</p>
            <p className="text-sm">{message.subject}</p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Message</p>
            <div className="p-3 bg-muted/50 rounded-lg border border-border/60">
              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          {message.status !== "replied" && (
            <Button
              onClick={() => onReply(message._id, "replied")}
              className="rounded-lg text-sm"
            >
              Mark as Replied
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.open(`mailto:${message.email}`)}
            className="rounded-lg text-sm"
          >
            Reply via Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
