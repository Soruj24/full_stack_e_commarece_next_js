"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Upload, Plus, X, GripVertical, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "../FormField";
import { useImageUpload } from "@/modules/products/hooks/use-image-upload";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import type { ProductFormData, ProductFormErrors } from "../types";

interface ImagesSectionProps {
  formData: ProductFormData;
  errors: ProductFormErrors;
  onChange: (field: keyof ProductFormData, value: string | boolean) => void;
  onImagesChange: (images: string[]) => void;
}

export function ImagesSection({
  formData,
  errors,
  onChange,
  onImagesChange,
}: ImagesSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const { uploading, handleFileUpload, addImage, removeImage } =
    useImageUpload(formData.images, onImagesChange);

  const handleAdd = () => {
    addImage(formData.newImageUrl);
    onChange("newImageUrl", "");
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.accept = "image/*";
        const dataTransfer = new DataTransfer();
        Array.from(e.dataTransfer.files).forEach((file) =>
          dataTransfer.items.add(file)
        );
        input.files = dataTransfer.files;
        const event = new Event("change", { bubbles: true });
        input.dispatchEvent(event);
        handleFileUpload({
          target: { files: e.dataTransfer.files, value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [handleFileUpload]
  );

  return (
    <div className="space-y-4">
      <FormField label="Product Images" error={errors.images}>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-border"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-muted/50 rounded-xl">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {uploading ? "Uploading..." : "Drop images here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF, SVG up to 5MB each
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Input
            value={formData.newImageUrl}
            onChange={(e) => onChange("newImageUrl", e.target.value)}
            placeholder="Or paste image URL"
            className="h-9 rounded-lg flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="h-9 px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </FormField>

      {formData.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {formData.images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-lg overflow-hidden border border-border/60 group bg-muted"
            >
              <Image
                src={getSafeImageSrc(img)}
                alt={`Product ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackImage();
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-destructive text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-3 w-3" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  Primary
                </span>
              )}
              <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-white drop-shadow" />
              </div>
            </div>
          ))}
          <label className="aspect-square rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
              disabled={uploading}
            />
            <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Add more</span>
          </label>
        </div>
      )}
    </div>
  );
}
