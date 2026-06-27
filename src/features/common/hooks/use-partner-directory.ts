"use client";

import { useState, useMemo } from "react";
import { partners } from "@/lib/data/partners-directory";

export function usePartnerDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<typeof partners[0] | null>(null);

  const filteredPartners = useMemo(() =>
    partners.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesTier = !selectedTier || p.tier === selectedTier;
      return matchesSearch && matchesCategory && matchesTier;
    }),
    [searchQuery, selectedCategory, selectedTier],
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTier(null);
  };

  return {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedTier, setSelectedTier,
    showFilters, setShowFilters,
    selectedPartner, setSelectedPartner,
    filteredPartners, clearFilters,
  };
}
