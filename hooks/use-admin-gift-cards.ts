"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchGiftCards, createGiftCard, toggleGiftCard, deleteGiftCard, copyCode } from "@/lib/services/gift-cards-service";
import type { GiftCard } from "@/lib/services/gift-cards-service";

const initialForm = {
  amount: "", senderName: "", senderEmail: "",
  recipientName: "", recipientEmail: "", message: "",
};

export function useAdminGiftCards() {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const loadGiftCards = async () => {
    setLoading(true);
    try {
      const cards = await fetchGiftCards();
      setGiftCards(cards);
    } catch {
      toast.error("Failed to fetch gift cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGiftCards(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const card = await createGiftCard(formData);
      toast.success(`Gift card created: ${card.code}`);
      setIsCreateOpen(false);
      setFormData(initialForm);
      loadGiftCards();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create gift card");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (card: GiftCard) => {
    try {
      await toggleGiftCard(card.code, !card.isActive);
      toast.success(`Gift card ${card.isActive ? "deactivated" : "activated"}`);
      loadGiftCards();
    } catch {
      toast.error("Failed to update gift card");
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Are you sure you want to delete this gift card?")) return;
    try {
      await deleteGiftCard(code);
      toast.success("Gift card deleted");
      loadGiftCards();
    } catch {
      toast.error("Failed to delete gift card");
    }
  };

  const handleCopyCode = (code: string) => {
    copyCode(code);
    toast.success("Code copied!");
  };

  const filteredCards = giftCards.filter(
    (card) =>
      card.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.recipientEmail?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalValue = giftCards.reduce((acc, card) => acc + card.amount, 0);
  const totalRemaining = giftCards.reduce((acc, card) => acc + card.remainingBalance, 0);

  return {
    giftCards, loading, searchQuery, setSearchQuery,
    isCreateOpen, setIsCreateOpen, creating, formData, setFormData,
    filteredCards, totalValue, totalRemaining,
    handleCreate, handleToggleActive, handleDelete, handleCopyCode,
  };
}
