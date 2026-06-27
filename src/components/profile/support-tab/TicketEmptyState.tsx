import { MessageCircle } from "lucide-react";

export function TicketEmptyState() {
  return (
    <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-border">
      <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-muted-foreground font-medium">No support tickets found.</p>
    </div>
  );
}
