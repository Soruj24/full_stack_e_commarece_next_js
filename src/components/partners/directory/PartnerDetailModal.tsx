"use client";

import Image from "next/image";
import { X, Star, CheckCircle2, ExternalLink, Mail, MapPin, Badge as BadgeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getTierColor } from "@/lib/data/partners-directory";
import type { Partner } from "@/lib/data/partners-directory";

interface Props {
  partner: Partner;
  onClose: () => void;
}

export function PartnerDetailModal({ partner, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-48 bg-gradient-to-r from-primary/20 to-primary/5">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 -mt-16 relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-card border-4 border-card shadow-lg">
                <Image src={partner.logo} alt={partner.name} width={96} height={96} className="object-cover" />
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{partner.name}</h2>
                  {partner.verified && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <Badge className={cn("font-bold text-xs mt-1", getTierColor(partner.tier))}>{partner.tier} Partner</Badge>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mb-6">{partner.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{partner.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">{partner.reviews} reviews</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="font-bold mb-1">{partner.founded}</p>
              <p className="text-xs text-muted-foreground">Founded</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="font-bold mb-1">{partner.employees}</p>
              <p className="text-xs text-muted-foreground">Employees</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="font-bold mb-1">{partner.integrations.length}</p>
              <p className="text-xs text-muted-foreground">Integrations</p>
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-bold mb-3">Integrations</h4>
            <div className="flex flex-wrap gap-2">
              {partner.integrations.map((int) => <Badge key={int} variant="secondary">{int}</Badge>)}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full gap-2"><ExternalLink className="w-4 h-4" /> Visit Website</Button>
            </a>
            <Button variant="outline" className="flex-1 gap-2"><Mail className="w-4 h-4" /> Contact Partner</Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {partner.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
