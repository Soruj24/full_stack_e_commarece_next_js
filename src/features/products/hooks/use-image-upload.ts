"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useImageUpload(
  images: string[],
  onImagesChange: (images: string[]) => void,
) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];
    try {
      for (const file of files) {
        const data = new FormData();
        data.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const result = await res.json();
        if (result.success) uploadedUrls.push(result.url);
        else toast.error(`Failed to upload ${file.name}`);
      }
      onImagesChange([...images, ...uploadedUrls]);
      toast.success("Images uploaded successfully");
    } catch { toast.error("Upload failed"); } finally { setUploading(false); e.target.value = ""; }
  };

  const addImage = (newImageUrl: string) => {
    if (!newImageUrl || newImageUrl.trim() === "") return;
    onImagesChange([...images, newImageUrl.trim()]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return { uploading, handleFileUpload, addImage, removeImage };
}
