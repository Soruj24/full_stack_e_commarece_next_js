"use client";

import { AnimatePresence } from "framer-motion";
import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductQuestions } from "@/features/products/hooks/use-product-questions";
import { QuestionHeader } from "./product-questions/QuestionHeader";
import { AskQuestionForm } from "./product-questions/AskQuestionForm";
import { QuestionItem } from "./product-questions/QuestionItem";
import { QuestionsEmptyState } from "./product-questions/QuestionsEmptyState";

interface ProductQuestionsProps {
  productId: string;
  productName?: string;
}

export function ProductQuestions({ productId, productName }: ProductQuestionsProps) {
  const {
    questions, loading, showAll, setShowAll,
    showAskForm, setShowAskForm,
    newQuestion, setNewQuestion,
    submitting, helpfulIds,
    displayedQuestions, answeredCount,
    handleSubmitQuestion, handleMarkHelpful,
  } = useProductQuestions(productId);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      <QuestionHeader
        total={questions.length}
        answered={answeredCount}
        onToggleForm={() => setShowAskForm(!showAskForm)}
      />

      <AnimatePresence>
        <AskQuestionForm
          show={showAskForm}
          productName={productName}
          question={newQuestion}
          onQuestionChange={setNewQuestion}
          onSubmit={handleSubmitQuestion}
          onCancel={() => { setShowAskForm(false); setNewQuestion(""); }}
          submitting={submitting}
        />
      </AnimatePresence>

      <div className="divide-y divide-zinc-100 dark:divide-white/5">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
          </div>
        ) : questions.length === 0 ? (
          <QuestionsEmptyState onAsk={() => setShowAskForm(true)} />
        ) : (
          displayedQuestions.map((question, index) => (
            <QuestionItem
              key={question._id}
              question={question}
              index={index}
              isHelpful={helpfulIds.includes(question._id)}
              onMarkHelpful={handleMarkHelpful}
            />
          ))
        )}
      </div>

      {questions.length > 4 && (
        <div className="p-4 border-t border-zinc-100 dark:border-white/10">
          <Button variant="ghost" className="w-full rounded-xl" onClick={() => setShowAll(!showAll)}>
            {showAll ? (
              <>Show Less<ChevronUp className="w-4 h-4 ml-2" /></>
            ) : (
              <>Show All {questions.length} Questions<ChevronDown className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
