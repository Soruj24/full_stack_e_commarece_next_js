import { useState, useEffect } from "react";
import { toast } from "sonner";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  views: number;
}

interface FaqCategory {
  category: string;
  slug: string;
  icon: string;
  description: string;
  faqs: FaqItem[];
}

export function useFaqPage() {
  const [faqs, setFaqs] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
        setExpandedCategories(data.data.map((c: FaqCategory) => c.category));
      }
    } catch { toast.error("Failed to load FAQs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const filteredFaqs = searchQuery
    ? faqs.map((cat) => ({
        ...cat,
        faqs: cat.faqs.filter((faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.faqs.length > 0)
    : faqs;

  const totalQuestions = faqs.reduce((acc, cat) => acc + cat.faqs.length, 0);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return { faqs, loading, searchQuery, setSearchQuery, expandedCategories, setExpandedCategories, expandedItems, filteredFaqs, totalQuestions, toggleItem };
}
