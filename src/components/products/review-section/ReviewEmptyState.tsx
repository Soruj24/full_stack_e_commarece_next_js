import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewEmptyState() {
  return (
    <div className="bg-card/40 backdrop-blur-xl rounded-[64px] p-16 sm:p-24 text-center border border-dashed border-border/40 group hover:border-primary/40 transition-all duration-700 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="relative z-10 space-y-10">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-card border border-border/40 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
          <MessageSquare className="w-10 h-10 sm:w-16 sm:h-16 text-primary" />
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic">
            Zero <span className="text-primary not-italic">Feedback</span>
          </h3>
          <p className="text-muted-foreground font-bold text-base sm:text-xl max-w-md mx-auto leading-relaxed uppercase tracking-widest">
            Be the first operative to provide intelligence on this asset. Your feedback is vital for the community.
          </p>
        </div>
        <Button
          onClick={() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" })}
          className="rounded-full px-12 h-16 font-black text-xs uppercase tracking-[0.3em] bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105 transition-all duration-500"
        >
          Submit Intel
        </Button>
      </div>
    </div>
  );
}
