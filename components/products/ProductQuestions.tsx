"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Question {
  _id: string;
  productId: string;
  question: string;
  answer?: string;
  user: {
    name: string;
    image?: string;
  };
  seller?: {
    name: string;
    image?: string;
  };
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductQuestionsProps {
  productId: string;
  productName?: string;
}

export function ProductQuestions({ productId, productName }: ProductQuestionsProps) {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/products/${productId}/questions`);
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions || []);
        }
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [productId]);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter your question");
      return;
    }

    if (newQuestion.length < 10) {
      toast.error("Question must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion }),
      });

      const data = await res.json();
      if (data.success) {
        setQuestions([data.question, ...questions]);
        setNewQuestion("");
        setShowAskForm(false);
        toast.success("Question submitted! We'll respond soon.");
      } else {
        toast.error(data.error || "Failed to submit question");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (questionId: string) => {
    if (helpfulIds.includes(questionId)) {
      toast.error("You've already marked this as helpful");
      return;
    }

    try {
      const res = await fetch(`/api/products/${productId}/questions/${questionId}/helpful`, {
        method: "POST",
      });

      const data = await res.json();
      if (data.success) {
        setQuestions(
          questions.map((q) =>
            q._id === questionId ? { ...q, helpful: q.helpful + 1 } : q
          )
        );
        setHelpfulIds([...helpfulIds, questionId]);
        toast.success("Thanks for your feedback!");
      }
    } catch {
      toast.error("Failed to mark as helpful");
    }
  };

  const displayedQuestions = showAll ? questions : questions.slice(0, 4);
  const answeredQuestions = questions.filter((q) => q.answer);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-zinc-100 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Questions & Answers</h3>
            <p className="text-xs text-zinc-500">
              {questions.length} question{questions.length !== 1 ? "s" : ""} • {answeredQuestions.length} answered
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAskForm(!showAskForm)}
          className="rounded-xl"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Ask Form */}
      <AnimatePresence>
        {showAskForm && (
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
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                maxLength={500}
                className="min-h-[100px] rounded-xl mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">
                  {newQuestion.length}/500
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAskForm(false);
                      setNewQuestion("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitQuestion}
                    disabled={submitting || !newQuestion.trim()}
                    size="sm"
                    className="rounded-xl"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Question
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions List */}
      <div className="divide-y divide-zinc-100 dark:divide-white/5">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-400" />
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/10 mx-auto flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-zinc-400" />
            </div>
            <h4 className="font-semibold mb-1">No questions yet</h4>
            <p className="text-sm text-zinc-500 mb-4">
              Be the first to ask about this product
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAskForm(true)}
              className="rounded-xl"
            >
              Ask a Question
            </Button>
          </div>
        ) : (
          <>
            {displayedQuestions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5"
              >
                {/* Question */}
                <div className="flex gap-3 mb-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={question.user.image} />
                    <AvatarFallback className="text-xs">
                      {question.user.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {question.user.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{question.question}</p>
                    
                    <button
                      onClick={() => handleMarkHelpful(question._id)}
                      disabled={helpfulIds.includes(question._id)}
                      className={`flex items-center gap-1 mt-2 text-xs transition-colors ${
                        helpfulIds.includes(question._id)
                          ? "text-primary"
                          : "text-zinc-400 hover:text-primary"
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Helpful ({question.helpful})
                    </button>
                  </div>
                </div>

                {/* Answer */}
                {question.answer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="ml-11 p-4 bg-green-50/50 dark:bg-green-500/5 border border-green-200/20 dark:border-green-500/20 rounded-2xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600">
                        Seller Response
                      </span>
                      {question.seller && (
                        <span className="text-xs text-zinc-500">
                          from {question.seller.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{question.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Show More */}
      {questions.length > 4 && (
        <div className="p-4 border-t border-zinc-100 dark:border-white/10">
          <Button
            variant="ghost"
            className="w-full rounded-xl"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Show All {questions.length} Questions
                <ChevronDown className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
