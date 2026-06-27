"use client";

import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AskQuestionFormProps {
  show: boolean;
  productName?: string;
  question: string;
  onQuestionChange: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
}

export function AskQuestionForm({ show, productName, question, onQuestionChange, onSubmit, onCancel, submitting }: AskQuestionFormProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="p-5 border-b border-zinc-100 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
          Your Question
        </label>
        <Textarea
          placeholder={`Ask a question about ${productName || "this product"}...`}
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          maxLength={500}
          className="min-h-[100px] rounded-xl mb-3"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-400">{question.length}/500</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
            <Button onClick={onSubmit} disabled={submitting || !question.trim()} size="sm" className="rounded-xl">
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />Submit Question</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
