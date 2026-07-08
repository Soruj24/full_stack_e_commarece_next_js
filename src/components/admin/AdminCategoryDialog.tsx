"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ICategory } from "@/shared/types";
import { useCategoryDialog } from "@/modules/products/hooks/use-category-dialog";
import { FormFields } from "./category-dialog/FormFields";
import { ImageField } from "./category-dialog/ImageField";
import { ToggleFields } from "./category-dialog/ToggleFields";
import { SeoFields } from "./category-dialog/SeoFields";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ICategory | null;
  onSuccess: () => void;
}

export function AdminCategoryDialog({
  open,
  onOpenChange,
  category,
  onSuccess,
}: CategoryDialogProps) {
  const {
    loading,
    categories,
    showImagePreview,
    setShowImagePreview,
    formData,
    updateField,
    handleSubmit,
  } = useCategoryDialog(open, category, onSuccess, onOpenChange);

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
          <FormFields
            name={formData.name}
            icon={formData.icon}
            parent={formData.parent}
            categories={categories}
            onFieldChange={updateField}
          />

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Short description for the category..."
              className="min-h-[80px] rounded-3xl bg-muted/50 border-border/50 p-6"
            />
          </div>

          <ImageField
            image={formData.image}
            onFieldChange={updateField}
          />

          <ToggleFields
            isActive={formData.isActive}
            isFeatured={formData.isFeatured}
            order={formData.order}
            onFieldChange={updateField}
          />

          <SeoFields
            metaTitle={formData.metaTitle}
            metaDescription={formData.metaDescription}
            onFieldChange={updateField}
          />

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
