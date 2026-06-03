"use client";

import Image from "next/image";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeImageSrc, getFallbackImage } from "@/lib/utils";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ProductFormData } from "./types";

interface ProductImageUploadProps {
  formData: ProductFormData;
  setFormData: (data: ProductFormData) => void;
}

export function ProductImageUpload({ formData, setFormData }: ProductImageUploadProps) {
  const { uploading, handleFileUpload, addImage, removeImage } = useImageUpload(
    formData.images,
    (images) => setFormData({ ...formData, images }),
  );

  const handleAdd = () => {
    addImage(formData.newImageUrl);
    setFormData({ ...formData, newImageUrl: "" });
  };

  return (
    <div className="space-y-4">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Product Images</Label>
      <div className="flex flex-col gap-4">
        <div className="border-2 border-dashed border-border/50 rounded-3xl p-8 text-center hover:bg-muted/30 transition-colors relative">
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-primary/10 text-primary rounded-full"><Upload className="w-6 h-6" /></div>
            <div className="space-y-1"><p className="font-bold">Click to upload images</p><p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF</p></div>
            {uploading && <p className="text-primary font-bold animate-pulse">Uploading...</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <Input value={formData.newImageUrl} onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
            placeholder="Or enter image URL" className="h-14 rounded-2xl bg-muted/50 border-border/50 flex-1" />
          <Button type="button" onClick={handleAdd} className="h-14 rounded-2xl px-6"><Plus className="w-5 h-5" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {(formData.images || []).map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border/50 group bg-muted">
            <Image src={getSafeImageSrc(img)} alt={`Product ${idx}`} fill className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(); }} />
            <button type="button" onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><X className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
