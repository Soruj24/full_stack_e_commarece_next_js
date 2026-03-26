"use client";

import { ContactMessage } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar } from "lucide-react";

interface AdminContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ContactMessage | null;
  onReply: (id: string, status: string) => void;
}

export function AdminContactDialog({
  open,
  onOpenChange,
  message,
  onReply,
}: AdminContactDialogProps) {
  if (!message) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
          <DialogDescription>
            From {message.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{message.email}</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              {message.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formatDate(message.createdAt)}
            </span>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Subject</h4>
            <p className="text-muted-foreground">{message.subject}</p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Message</h4>
            <div className="p-4 bg-muted rounded-lg">
              <p className="whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {message.status !== "replied" && (
            <Button onClick={() => onReply(message._id, "replied")}>
              Mark as Replied
            </Button>
          )}
          <Button variant="outline" onClick={() => window.open(`mailto:${message.email}`)}>
            Reply via Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
