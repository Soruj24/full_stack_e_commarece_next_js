"use client";

import { AdminCategoryDialog } from "@/components/admin/AdminCategoryDialog";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import {
  CategoriesHeader,
  CategoriesStats,
  CategoriesSearch,
  CategoriesTable,
} from "@/components/admin/categories";
import { BulkActions } from "@/components/admin/categories/BulkActions";
import { useAdminCategories } from "@/hooks/use-admin-categories";

export default function CategoriesPage() {
  const {
    categories, loading, keyword, setKeyword, selectedCategory, setSelectedCategory,
    isDialogOpen, setIsDialogOpen, selectedIds, pagination, stats,
    fetchCategories, handlePageChange, handleDelete, handleToggleActive, handleToggleFeatured,
    handleBulkDelete, handleBulkToggleFeatured, handleBulkToggleActive,
    handleSelectAll, handleSelectOne, handleAddCategory,
  } = useAdminCategories();

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <CategoriesHeader
          loading={loading}
          onRefresh={() => fetchCategories(pagination.page)}
          onAddCategory={handleAddCategory}
        />

        <CategoriesStats
          total={pagination.total}
          topLevel={stats.totalTopLevel}
          subcategories={stats.totalSubcategories}
          active={stats.totalActive}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <CategoriesSearch value={keyword} onChange={setKeyword} />
            {selectedIds.length > 0 && (
              <BulkActions
                selectedCount={selectedIds.length}
                onBulkDelete={handleBulkDelete}
                onBulkFeature={() => handleBulkToggleFeatured(true)}
                onBulkUnfeature={() => handleBulkToggleFeatured(false)}
                onBulkActivate={() => handleBulkToggleActive(true)}
                onBulkDeactivate={() => handleBulkToggleActive(false)}
              />
            )}
          </div>

          <CategoriesTable
            categories={categories}
            selectedIds={selectedIds}
            onEdit={(category) => { setSelectedCategory(category); setIsDialogOpen(true); }}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleFeatured={handleToggleFeatured}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
          />

          <div className="p-4 border-t border-border/50">
            <ProfessionalPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <AdminCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSuccess={() => fetchCategories(pagination.page)}
      />
    </div>
  );
}