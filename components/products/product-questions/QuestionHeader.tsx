import { MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionHeaderProps {
  total: number;
  answered: number;
  onToggleForm: () => void;
}

export function QuestionHeader({ total, answered, onToggleForm }: QuestionHeaderProps) {
  return (
    <div className="p-5 border-b border-zinc-100 dark:border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold">Questions & Answers</h3>
          <p className="text-xs text-zinc-500">
            {total} question{total !== 1 ? "s" : ""} • {answered} answered
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onToggleForm} className="rounded-xl">
        <HelpCircle className="w-4 h-4 mr-2" />
        Ask Question
      </Button>
    </div>
  );
}
