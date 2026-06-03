"use client";

import Image from "next/image";
import { Star, CheckCircle2, MapPin, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getTierColor } from "@/lib/data/partners-directory";
import type { Partner } from "@/lib/data/partners-directory";

interface Props {
  partner: Partner;
  onSelect: (p: Partner) => void;
}

export function PartnerCard({ partner, onSelect }: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onSelect(partner)}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-muted">
            <Image src={partner.logo} alt={partner.name} fill className="object-cover" />
          </div>
          <Badge className={cn("font-bold text-xs", getTierColor(partner.tier))}>{partner.tier}</Badge>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{partner.name}</h3>
          {partner.verified && <CheckCircle2 className="w-4 h-4 text-primary" />}
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{partner.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{partner.location}</span>
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{partner.integrations.length} integrations</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{partner.rating}</span>
            <span className="text-sm text-muted-foreground">({partner.reviews.toLocaleString()})</span>
          </div>
          <div className="flex gap-1">
            {partner.integrations.slice(0, 2).map((int) => (
              <Badge key={int} variant="secondary" className="text-xs">{int}</Badge>
            ))}
            {partner.integrations.length > 2 && (
              <Badge variant="secondary" className="text-xs">+{partner.integrations.length - 2}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
