"use client";

import { HelpCircle } from "lucide-react";
import { useAdminFaqs } from "@/modules/admin/hooks/use-admin-faqs";
import { FaqFormDialog } from "@/components/admin/faqs/FaqFormDialog";
import { FaqTable } from "@/components/admin/faqs/FaqTable";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default function AdminFaqsPage() {
  const {
    filteredFaqs,
    loading,
    searchQuery,
    setSearchQuery,
    isCreateOpen,
    setIsCreateOpen,
    editingFaq,
    setEditingFaq,
    saving,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleTogglePublish,
  } = useAdminFaqs();

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ Management"
        description="Manage frequently asked questions"
        action={
          <FaqFormDialog
            isOpen={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            editingFaq={editingFaq}
            saving={saving}
            formData={formData}
            onFormChange={(data) => setFormData({ ...formData, ...data })}
            onSubmit={handleSubmit}
            onAddNew={() => {
              setEditingFaq(null);
              setFormData({ question: "", answer: "", category: "", order: 0, isPublished: true });
            }}
          />
        }
      />

      <FaqTable
        faqs={filteredFaqs}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={handleEdit}
        onTogglePublish={handleTogglePublish}
        onDelete={handleDelete}
      />
    </div>
  );
}
