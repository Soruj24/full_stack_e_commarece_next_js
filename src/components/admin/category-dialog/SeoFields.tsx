"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SeoFieldsProps {
  metaTitle: string;
  metaDescription: string;
  onFieldChange: (key: string, value: string | boolean | number) => void;
}

export function SeoFields({
  metaTitle,
  metaDescription,
  onFieldChange,
}: SeoFieldsProps) {
  return (
    <div className="border-t border-border/50 pt-6">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-4 block">
        SEO Settings
      </Label>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex justify-between">
            <span>Meta Title</span>
            <span className="text-muted-foreground font-normal">
              {metaTitle.length}/70
            </span>
          </Label>
          <Input
            value={metaTitle}
            onChange={(e) => onFieldChange("metaTitle", e.target.value)}
            placeholder="SEO title (defaults to category name)"
            className="h-12 rounded-2xl bg-muted/50 border-border/50"
            maxLength={70}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 flex justify-between">
            <span>Meta Description</span>
            <span className="text-muted-foreground font-normal">
              {metaDescription.length}/160
            </span>
          </Label>
          <Textarea
            value={metaDescription}
            onChange={(e) => onFieldChange("metaDescription", e.target.value)}
            placeholder="SEO description for search engines..."
            className="min-h-[80px] rounded-3xl bg-muted/50 border-border/50 p-4"
            maxLength={160}
          />
        </div>
      </div>
    </div>
  );
}
