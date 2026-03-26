"use client";

import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IBanner } from "@/types";
import { getFallbackImage, cn } from "@/lib/utils";

interface BannerCardProps {
  banner: IBanner;
  onEdit: (banner: IBanner) => void;
  onDelete: (id: string) => void;
}

export function BannerCard({ banner, onEdit, onDelete }: BannerCardProps) {
  return (
    <div className="group relative rounded-[32px] overflow-hidden bg-card border border-border/50 shadow-2xl shadow-primary/5 transition-all hover:scale-[1.02]">
      <div className="relative aspect-[21/9] w-full bg-muted">
        <Image
          src={
            banner.image && banner.image.trim() !== ""
              ? banner.image
              : getFallbackImage()
          }
          alt={banner.title}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage();
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="text-sm font-medium text-white/80">
                  {banner.subtitle}
                </p>
              )}
            </div>
            <Badge
              className={cn(
                "border-none px-3 font-black uppercase tracking-widest text-[10px]",
                banner.isActive
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400",
              )}
            >
              {banner.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Badge variant="outline" className="rounded-lg uppercase">
            {banner.type}
          </Badge>
          {banner.link && (
            <span className="truncate max-w-[200px]">
              {banner.link}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-primary/10 hover:text-primary"
            onClick={() => onEdit(banner)}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(banner._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}