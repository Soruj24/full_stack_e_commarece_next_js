"use client";

import { useSession } from "next-auth/react";
import { useAdminGiftCards } from "@/modules/admin/hooks/use-admin-gift-cards";
import { GiftCardsHeader } from "@/components/admin/gift-cards/GiftCardsHeader";
import { GiftCardsStats } from "@/components/admin/gift-cards/GiftCardsStats";
import { GiftCardsTable } from "@/components/admin/gift-cards/GiftCardsTable";

export default function AdminGiftCardsPage() {
  useSession();
  const {
    loading, searchQuery, setSearchQuery,
    isCreateOpen, setIsCreateOpen, creating, formData, setFormData,
    filteredCards, totalValue, totalRemaining, giftCards,
    handleCreate, handleToggleActive, handleDelete, handleCopyCode,
  } = useAdminGiftCards();

  return (
    <div className="space-y-6">
      <GiftCardsHeader
        isCreateOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        creating={creating}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleCreate}
      />
      <GiftCardsStats totalCards={giftCards.length} totalValue={totalValue} totalRemaining={totalRemaining} />
      <GiftCardsTable
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredCards={filteredCards}
        onCopyCode={handleCopyCode}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
      />
    </div>
  );
}
