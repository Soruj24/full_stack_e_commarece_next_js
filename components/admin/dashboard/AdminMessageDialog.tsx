
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface AdminMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMessage: ContactMessage | null;
}

export function AdminMessageDialog({
  open,
  onOpenChange,
  selectedMessage,
}: AdminMessageDialogProps) {
  if (!selectedMessage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">
            Message Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{selectedMessage.subject}</h3>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                From: <span className="font-semibold text-foreground">{selectedMessage.name}</span>
                &lt;{selectedMessage.email}&gt;
              </p>
            </div>
            <Badge variant={selectedMessage.status === "read" ? "outline" : "default"}>
              {selectedMessage.status}
            </Badge>
          </div>

          <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
            <p className="whitespace-pre-wrap leading-relaxed">
              {selectedMessage.message}
            </p>
          </div>

          <div className="text-xs text-muted-foreground text-right">
            Received on {formatDate(selectedMessage.createdAt)}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary hover:bg-primary/90 rounded-xl font-bold"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
