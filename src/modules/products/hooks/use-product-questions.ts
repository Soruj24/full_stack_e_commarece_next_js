import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Question } from "@/modules/products/types/question";

export function useProductQuestions(productId: string) {
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
        if (data.success) setQuestions(data.questions || []);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [productId]);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) { toast.error("Please enter your question"); return; }
    if (newQuestion.length < 10) { toast.error("Question must be at least 10 characters"); return; }
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
    if (helpfulIds.includes(questionId)) { toast.error("You've already marked this as helpful"); return; }
    try {
      const res = await fetch(`/api/products/${productId}/questions/${questionId}/helpful`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setQuestions(questions.map((q) => (q._id === questionId ? { ...q, helpful: q.helpful + 1 } : q)));
        setHelpfulIds([...helpfulIds, questionId]);
        toast.success("Thanks for your feedback!");
      }
    } catch {
      toast.error("Failed to mark as helpful");
    }
  };

  const displayedQuestions = showAll ? questions : questions.slice(0, 4);
  const answeredCount = questions.filter((q) => q.answer).length;

  return {
    questions, loading, showAll, setShowAll,
    showAskForm, setShowAskForm,
    newQuestion, setNewQuestion,
    submitting, helpfulIds,
    displayedQuestions, answeredCount,
    handleSubmitQuestion, handleMarkHelpful,
  };
}
