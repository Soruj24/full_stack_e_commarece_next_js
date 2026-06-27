import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { FaqItem } from "@/features/support/types/faq";

const INITIAL_FORM = { question: "", answer: "", category: "", order: 0, isPublished: true };

export function useAdminFaqs() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      if (data.success) setFaqs(data.data.flatMap((cat: { faqs: FaqItem[] }) => cat.faqs));
    } catch { toast.error("Failed to fetch FAQs"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingFaq ? `/api/faqs/${editingFaq._id}` : "/api/faqs";
      const method = editingFaq ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editingFaq ? "FAQ updated" : "FAQ created");
      setIsCreateOpen(false);
      setEditingFaq(null);
      setFormData(INITIAL_FORM);
      fetchFaqs();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order, isPublished: faq.isPublished });
    setIsCreateOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("FAQ deleted"); fetchFaqs(); }
    } catch { toast.error("Failed to delete"); }
  };

  const handleTogglePublish = async (faq: FaqItem) => {
    try {
      const res = await fetch(`/api/faqs/${faq._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: !faq.isPublished }) });
      if (res.ok) { toast.success(faq.isPublished ? "FAQ hidden" : "FAQ published"); fetchFaqs(); }
    } catch { toast.error("Failed to update"); }
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    faqs, filteredFaqs, loading, searchQuery, setSearchQuery, isCreateOpen, setIsCreateOpen,
    editingFaq, setEditingFaq, saving, formData, setFormData, handleSubmit, handleEdit,
    handleDelete, handleTogglePublish,
  };
}
