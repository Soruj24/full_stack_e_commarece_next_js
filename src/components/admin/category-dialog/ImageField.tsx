"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, X } from "lucide-react";

interface ImageFieldProps {
  image: string;
  onFieldChange: (key: string, value: string | boolean | number) => void;
}

export function ImageField({ image, onFieldChange }: ImageFieldProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
        Image URL
      </Label>
      <div className="relative">
        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={image}
          onChange={(e) => {
            onFieldChange("image", e.target.value);
            setShowPreview(false);
          }}
          placeholder="https://example.com/image.jpg"
          className="h-14 pl-12 pr-12 rounded-2xl bg-muted/50 border-border/50"
        />
        {image && (
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
          >
            {showPreview ? "Hide" : "Preview"}
          </button>
        )}
      </div>
      {showPreview && image && (
        <div className="relative mt-2 rounded-2xl overflow-hidden border border-border/50">
          <img
            src={image}
            alt="Category preview"
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => {
              onFieldChange("image", "");
              setShowPreview(false);
            }}
            className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
