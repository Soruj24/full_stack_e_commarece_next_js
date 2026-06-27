"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePartnerDirectory } from "@/features/common/hooks/use-partner-directory";
import { PartnersDirectoryHeader } from "@/components/partners/directory/PartnersDirectoryHeader";
import { PartnerSidebar } from "@/components/partners/directory/PartnerSidebar";
import { PartnerCard } from "@/components/partners/directory/PartnerCard";
import { PartnerDetailModal } from "@/components/partners/directory/PartnerDetailModal";
import { PartnerEmptyState } from "@/components/partners/directory/PartnerEmptyState";

export default function PartnersDirectoryPage() {
  const {
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedTier, setSelectedTier,
    showFilters, setShowFilters,
    selectedPartner, setSelectedPartner,
    filteredPartners, clearFilters,
  } = usePartnerDirectory();

  return (
    <div className="min-h-screen bg-background">
      <PartnersDirectoryHeader
        total={filteredPartners.length}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <PartnerSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTier={selectedTier}
            onTierChange={setSelectedTier}
            show={showFilters}
          />

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredPartners.length}</span> partners
              </p>
              {(searchQuery || selectedCategory !== "all" || selectedTier) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
              )}
            </div>

            {filteredPartners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} onSelect={setSelectedPartner} />
                ))}
              </div>
            ) : (
              <PartnerEmptyState onClear={clearFilters} />
            )}
          </main>
        </div>
      </div>

      {selectedPartner && (
        <PartnerDetailModal partner={selectedPartner} onClose={() => setSelectedPartner(null)} />
      )}
    </div>
  );
}
