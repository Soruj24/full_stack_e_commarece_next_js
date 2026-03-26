"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Image as ImageIcon, X, ChevronDown } from "lucide-react";
import { ICategory } from "@/types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ICategory | null;
  onSuccess: () => void;
}

const ICON_OPTIONS = [
  { value: "laptop", label: "Laptop" },
  { value: "shirt", label: "Shirt" },
  { value: "home", label: "Home" },
  { value: "heart", label: "Beauty" },
  { value: "dumbbell", label: "Sports" },
  { value: "toy", label: "Toys" },
  { value: "car", label: "Automotive" },
  { value: "book", label: "Books" },
  { value: "utensils", label: "Kitchen" },
  { value: "camera", label: "Camera" },
  { value: "headphones", label: "Audio" },
  { value: "gamepad", label: "Gaming" },
  { value: "watch", label: "Watch" },
  { value: "gift", label: "Gift" },
  { value: "grid", label: "Other" },
];

export function AdminCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
    parent: "none",
    isFeatured: false,
    isActive: true,
    order: 0,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?all=true&active=true");
        const data = await res.json();
        if (data.success) {
          const availableParents = category
            ? data.categories.filter((c: ICategory) => c._id !== category._id)
            : data.categories;
          setCategories(availableParents);
        }
      } catch {
        console.error("Failed to fetch categories");
      }
    };
    if (open) {
      fetchCategories();
    }
  }, [open, category]);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        icon: category.icon || "",
        parent:
          typeof category.parent === "object" && category.parent !== null
            ? (category.parent as ICategory)._id || "none"
            : (category.parent as string) || "none",
        isFeatured: category.isFeatured || false,
        isActive: category.isActive !== false,
        order: category.order || 0,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        icon: "",
        parent: "none",
        isFeatured: false,
        isActive: true,
        order: 0,
        metaTitle: "",
        metaDescription: "",
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = category
        ? `/api/categories/${category._id}`
        : "/api/categories";
      const method = category ? "PATCH" : "POST";

      const payload: Partial<ICategory> = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        icon: formData.icon,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        order: formData.order,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      };

      if (formData.parent !== "none") {
        payload.parent = formData.parent;
      } else if (category) {
        payload.parent = null;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(category ? "Category updated" : "Category created");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[40px] p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-black tracking-tighter">
            {category ? "Edit" : "Add New"}{" "}
            <span className="text-primary">Category</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Category Name *
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Electronics"
                className="h-14 rounded-2xl bg-muted/50 border-border/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Icon
              </Label>
              <Select
                value={formData.icon}
                onValueChange={(value) =>
                  setFormData({ ...formData, icon: value })
                }
              >
                <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
                  <SelectValue placeholder="Select Icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Parent Category
            </Label>
            <Select
              value={formData.parent}
              onValueChange={(value) =>
                setFormData({ ...formData, parent: value })
              }
            >
              <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
                <SelectValue placeholder="Select Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Short description for the category..."
              className="min-h-[80px] rounded-3xl bg-muted/50 border-border/50 p-6"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Image URL
            </Label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setShowImagePreview(false);
                }}
                placeholder="https://example.com/image.jpg"
                className="h-14 pl-12 pr-12 rounded-2xl bg-muted/50 border-border/50"
              />
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setShowImagePreview(!showImagePreview)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
                >
                  {showImagePreview ? "Hide" : "Preview"}
                </button>
              )}
            </div>
            {showImagePreview && formData.image && (
              <div className="relative mt-2 rounded-2xl overflow-hidden border border-border/50">
                <img
                  src={formData.image}
                  alt="Category preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, image: "" });
                    setShowImagePreview(false);
                  }}
                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
              <Label className="text-sm font-bold">Active</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
              <Label className="text-sm font-bold">Featured</Label>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFeatured: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Order
              </Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                min={0}
                className="h-14 rounded-2xl bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="border-t border-border/50 pt-6">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-4 block">
              SEO Settings
            </Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex justify-between">
                  <span>Meta Title</span>
                  <span className="text-muted-foreground font-normal">
                    {formData.metaTitle.length}/70
                  </span>
                </Label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  placeholder="SEO title (defaults to category name)"
                  className="h-12 rounded-2xl bg-muted/50 border-border/50"
                  maxLength={70}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex justify-between">
                  <span>Meta Description</span>
                  <span className="text-muted-foreground font-normal">
                    {formData.metaDescription.length}/160
                  </span>
                </Label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  placeholder="SEO description for search engines..."
                  className="min-h-[80px] rounded-3xl bg-muted/50 border-border/50 p-4"
                  maxLength={160}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-bold px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-2xl font-black px-8"
            >
              {loading ? "Saving..." : "Save Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
