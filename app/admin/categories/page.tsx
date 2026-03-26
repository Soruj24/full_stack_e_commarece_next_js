"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { AdminCategoryDialog } from "@/components/admin/AdminCategoryDialog";
import { ICategory } from "@/types";
import { ProfessionalPagination } from "@/components/common/ProfessionalPagination";
import {
  CategoriesHeader,
  CategoriesStats,
  CategoriesSearch,
  CategoriesTable,
} from "@/components/admin/categories";
import { BulkActions } from "@/components/admin/categories/BulkActions";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    totalTopLevel: 0,
    totalSubcategories: 0,
    totalActive: 0
  });

  const fetchCategories = useCallback(async (page = 1, search = keyword) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?all=true&page=${page}&limit=${pagination.limit}&keyword=${search}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setPagination(prev => ({
          ...prev,
          page: data.pagination.page,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
        if (data.stats) {
          setStats(data.stats);
        }
        setSelectedIds([]);
      }
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories(1, keyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, fetchCategories]);

  const handlePageChange = (newPage: number) => {
    fetchCategories(newPage, keyword);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories(pagination.page);
      } else {
        toast.error(data.error || "Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleToggleActive = async (category: ICategory) => {
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: category.isActive === false ? true : false }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Category ${category.isActive === false ? "activated" : "deactivated"}`);
        fetchCategories(pagination.page);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleToggleFeatured = async (category: ICategory) => {
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !category.isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Category ${category.isFeatured ? "removed from" : "added to"} featured`);
        fetchCategories(pagination.page);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories? This action cannot be undone.`)) return;
    
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch {
        errorCount++;
      }
    }

    setLoading(false);
    setSelectedIds([]);

    if (successCount > 0) {
      toast.success(`${successCount} category(s) deleted`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} category(s) could not be deleted`);
    }
    fetchCategories(pagination.page);
  };

  const handleBulkToggleFeatured = async (featured: boolean) => {
    if (selectedIds.length === 0) return;
    setLoading(true);

    for (const id of selectedIds) {
      try {
        await fetch(`/api/categories/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFeatured: featured }),
        });
      } catch {
        // Continue with others
      }
    }

    setLoading(false);
    setSelectedIds([]);
    toast.success(`Updated featured status for ${selectedIds.length} category(s)`);
    fetchCategories(pagination.page);
  };

  const handleBulkToggleActive = async (active: boolean) => {
    if (selectedIds.length === 0) return;
    setLoading(true);

    for (const id of selectedIds) {
      try {
        await fetch(`/api/categories/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: active }),
        });
      } catch {
        // Continue with others
      }
    }

    setLoading(false);
    setSelectedIds([]);
    toast.success(`${active ? "Activated" : "Deactivated"} ${selectedIds.length} category(s)`);
    fetchCategories(pagination.page);
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedIds(categories.map(c => c._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, select: boolean) => {
    if (select) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

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
            <CategoriesSearch
              value={keyword}
              onChange={setKeyword}
            />
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
            onEdit={(category) => {
              setSelectedCategory(category);
              setIsDialogOpen(true);
            }}
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