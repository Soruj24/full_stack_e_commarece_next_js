import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ICategory } from "@/types";

export function useAdminCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [stats, setStats] = useState({ totalTopLevel: 0, totalSubcategories: 0, totalActive: 0 });

  const fetchCategories = useCallback(async (page = 1, search = keyword) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?all=true&page=${page}&limit=${pagination.limit}&keyword=${search}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setPagination(prev => ({ ...prev, page: data.pagination.page, total: data.pagination.total, pages: data.pagination.pages }));
        if (data.stats) setStats(data.stats);
        setSelectedIds([]);
      }
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, keyword]);

  useEffect(() => {
    const timer = setTimeout(() => fetchCategories(1, keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword, fetchCategories]);

  const handlePageChange = (newPage: number) => fetchCategories(newPage, keyword);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success("Category deleted"); fetchCategories(pagination.page); }
      else toast.error(data.error || "Failed to delete category");
    } catch { toast.error("Failed to delete category"); }
  };

  const handleToggleActive = async (category: ICategory) => {
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      const data = await res.json();
      if (data.success) { toast.success(`Category ${category.isActive ? "deactivated" : "activated"}`); fetchCategories(pagination.page); }
      else toast.error(data.error);
    } catch { toast.error("Failed to update category"); }
  };

  const handleToggleFeatured = async (category: ICategory) => {
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !category.isFeatured }),
      });
      const data = await res.json();
      if (data.success) { toast.success(`Category ${category.isFeatured ? "removed from" : "added to"} featured`); fetchCategories(pagination.page); }
      else toast.error(data.error);
    } catch { toast.error("Failed to update category"); }
  };

  const handleBulkOp = async (operation: (id: string) => Promise<void>) => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    for (const id of selectedIds) { try { await operation(id); } catch { /* continue */ } }
    setLoading(false);
    setSelectedIds([]);
    fetchCategories(pagination.page);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories? This action cannot be undone.`)) return;
    let successCount = 0, errorCount = 0;
    for (const id of selectedIds) {
      try { const res = await fetch(`/api/categories/${id}`, { method: "DELETE" }); if (res.ok) successCount++; else errorCount++; }
      catch { errorCount++; }
    }
    setSelectedIds([]);
    if (successCount > 0) toast.success(`${successCount} category(s) deleted`);
    if (errorCount > 0) toast.error(`${errorCount} category(s) could not be deleted`);
    fetchCategories(pagination.page);
  };

  const handleBulkToggleFeatured = async (featured: boolean) => {
    handleBulkOp(async (id) => {
      await fetch(`/api/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isFeatured: featured }) });
    });
  };

  const handleBulkToggleActive = async (active: boolean) => {
    handleBulkOp(async (id) => {
      await fetch(`/api/categories/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: active }) });
    });
  };

  const handleSelectAll = (select: boolean) => setSelectedIds(select ? categories.map(c => c._id) : []);
  const handleSelectOne = (id: string, select: boolean) => {
    setSelectedIds(prev => select ? [...prev, id] : prev.filter(i => i !== id));
  };
  const handleAddCategory = () => { setSelectedCategory(null); setIsDialogOpen(true); };

  return {
    categories, loading, keyword, setKeyword, selectedCategory, setSelectedCategory,
    isDialogOpen, setIsDialogOpen, selectedIds, pagination, stats,
    fetchCategories, handlePageChange, handleDelete, handleToggleActive, handleToggleFeatured,
    handleBulkDelete, handleBulkToggleFeatured, handleBulkToggleActive,
    handleSelectAll, handleSelectOne, handleAddCategory,
  };
}
