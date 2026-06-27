import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionsEmptyStateProps {
  onAsk: () => void;
}

export function QuestionsEmptyState({ onAsk }: QuestionsEmptyStateProps) {
  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/10 mx-auto flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-zinc-400" />
      </div>
      <h4 className="font-semibold mb-1">No questions yet</h4>
      <p className="text-sm text-zinc-500 mb-4">Be the first to ask about this product</p>
      <Button variant="outline" size="sm" onClick={onAsk} className="rounded-xl">
        Ask a Question
      </Button>
    </div>
  );
}
