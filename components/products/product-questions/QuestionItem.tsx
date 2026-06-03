import { motion } from "framer-motion";
import { ThumbsUp, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { Question } from "@/types/question";

interface QuestionItemProps {
  question: Question;
  index: number;
  isHelpful: boolean;
  onMarkHelpful: (id: string) => void;
}

export function QuestionItem({ question, index, isHelpful, onMarkHelpful }: QuestionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5"
    >
      <div className="flex gap-3 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={question.user.image} />
          <AvatarFallback className="text-xs">{question.user.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{question.user.name}</span>
            <span className="text-xs text-zinc-400">
              {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{question.question}</p>
          <button
            onClick={() => onMarkHelpful(question._id)}
            disabled={isHelpful}
            className={`flex items-center gap-1 mt-2 text-xs transition-colors ${isHelpful ? "text-primary" : "text-zinc-400 hover:text-primary"}`}
          >
            <ThumbsUp className="w-3 h-3" />
            Helpful ({question.helpful})
          </button>
        </div>
      </div>

      {question.answer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="ml-11 p-4 bg-green-50/50 dark:bg-green-500/5 border border-green-200/20 dark:border-green-500/20 rounded-2xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-600">Seller Response</span>
            {question.seller && <span className="text-xs text-zinc-500">from {question.seller.name}</span>}
          </div>
          <p className="text-sm">{question.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
