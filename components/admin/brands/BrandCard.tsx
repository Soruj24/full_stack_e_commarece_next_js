"use client";

import Image from "next/image";
import { Globe, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFallbackImage } from "@/lib/utils";

interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
}

interface BrandCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

export function BrandCard({ brand, onEdit, onDelete }: BrandCardProps) {
  return (
    <div className="group bg-card border border-border/50 rounded-[32px] p-6 space-y-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
      <div className="flex items-start justify-between">
        <div className="relative h-16 w-16 rounded-2xl bg-muted/50 border border-border/50 overflow-hidden">
          <Image
            src={brand.logo && brand.logo.trim() !== "" ? brand.logo : "/placeholder.svg"}
            alt={brand.name}
            fill
            className="object-contain p-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackImage();
            }}
          />
        </div>
        <Badge
          variant={brand.isActive ? "default" : "secondary"}
          className="rounded-full px-3 py-1 font-bold"
        >
          {brand.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div>
        <h3 className="text-xl font-black tracking-tight mb-1">
          {brand.name}
        </h3>
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-medium truncate"
          >
            <Globe className="w-3 h-3" />
            {brand.website.replace(/^https?:\/\//, "")}
          </a>
        )}
        {brand.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {brand.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          className="flex-1 rounded-xl font-bold hover:bg-primary/10 hover:text-primary"
          onClick={() => onEdit(brand)}
        >
          <Edit3 className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button
          variant="ghost"
          className="flex-1 rounded-xl font-bold hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(brand._id)}
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </div>
    </div>
  );
}