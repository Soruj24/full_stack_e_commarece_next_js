"use client";

import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MarketingBanner } from "@/modules/admin/types/marketing";
import { BannerForm } from "./BannerForm";
import { NewBannerForm } from "@/modules/admin/types/marketing";

interface BannerSectionProps {
  banners: MarketingBanner[];
  showAdd: boolean;
  newBanner: NewBannerForm;
  onToggleShow: () => void;
  onNewBannerChange: (data: NewBannerForm) => void;
  onAdd: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, current: boolean) => void;
}

export function BannerSection({
  banners, showAdd, newBanner,
  onToggleShow, onNewBannerChange, onAdd,
  onDelete, onToggleStatus,
}: BannerSectionProps) {
  return (
    <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <CardHeader className="py-8 px-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black text-primary flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            Promotion Banners
          </CardTitle>
          <Button
            onClick={onToggleShow}
            variant={showAdd ? "outline" : "default"}
            className="rounded-2xl font-bold px-6 py-6 h-auto shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            {showAdd ? "Cancel" : (
              <><Plus className="mr-2 h-5 w-5" />Create New Banner</>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-10 pb-10">
        {showAdd && (
          <BannerForm
            data={newBanner}
            onChange={onNewBannerChange}
            onSubmit={onAdd}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.length === 0 ? (
            <div className="lg:col-span-3 group relative aspect-[16/5] rounded-[24px] overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center p-6 text-center transition-all hover:border-primary/50">
              <div className="p-4 bg-muted-foreground/10 rounded-full mb-4">
                <Plus className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <p className="font-bold text-muted-foreground/60">No active banners</p>
              <p className="text-sm text-muted-foreground/40 mt-1">Upload a banner image to start promoting</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner._id} className="group relative rounded-[24px] overflow-hidden bg-muted border border-border/50 shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-[16/9] relative">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-black text-lg">{banner.title}</p>
                    <p className="text-white/80 text-xs font-medium">{banner.subtitle}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary" className="rounded-xl h-8 w-8 bg-white/90 hover:bg-white text-destructive" onClick={() => onDelete(banner._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className={cn("rounded-xl h-8 w-8 bg-white/90 hover:bg-white", banner.isActive ? "text-emerald-500" : "text-muted-foreground")} onClick={() => onToggleStatus(banner._id, banner.isActive)}>
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="rounded-lg text-[10px] font-black uppercase tracking-widest">{banner.type}</Badge>
                    <Badge className={cn("rounded-lg text-[10px] font-black uppercase tracking-widest", banner.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                      {banner.isActive ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <p className="font-bold text-sm truncate">{banner.title}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
