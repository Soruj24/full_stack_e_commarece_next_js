"use client";

import { HelpCircle } from "lucide-react";
import { useAdminFaqs } from "@/modules/admin/hooks/use-admin-faqs";
import { FaqFormDialog } from "@/components/admin/faqs/FaqFormDialog";
import { FaqTable } from "@/components/admin/faqs/FaqTable";

export default function AdminFaqsPage() {
  const { filteredFaqs, loading, searchQuery, setSearchQuery, isCreateOpen, setIsCreateOpen, editingFaq, setEditingFaq, saving, formData, setFormData, handleSubmit, handleEdit, handleDelete, handleTogglePublish } = useAdminFaqs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FAQ Management</h1>
          <p className="text-muted-foreground">Manage frequently asked questions</p>
        </div>
        <FaqFormDialog
          isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}
          editingFaq={editingFaq} saving={saving} formData={formData}
          onFormChange={(data) => setFormData({ ...formData, ...data })}
          onSubmit={handleSubmit}
          onAddNew={() => { setEditingFaq(null); setFormData({ question: "", answer: "", category: "", order: 0, isPublished: true }); }}
        />
      </div>
      <FaqTable
        faqs={filteredFaqs} loading={loading}
        searchQuery={searchQuery} onSearchChange={setSearchQuery}
        onEdit={handleEdit} onTogglePublish={handleTogglePublish} onDelete={handleDelete}
      />
    </div>
  );
}
