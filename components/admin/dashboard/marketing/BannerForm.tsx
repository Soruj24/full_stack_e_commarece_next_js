"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewBannerForm } from "@/types/admin/marketing";

interface BannerFormProps {
  data: NewBannerForm;
  onChange: (data: NewBannerForm) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BannerForm({ data, onChange, onSubmit }: BannerFormProps) {
  const update = (partial: Partial<NewBannerForm>) =>
    onChange({ ...data, ...partial });

  return (
    <div className="mb-10 p-8 bg-muted/30 rounded-[32px] border border-border/50 animate-in slide-in-from-top duration-300">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Title</Label>
          <Input
            placeholder="Summer Sale 2025"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Subtitle</Label>
          <Input
            placeholder="Up to 50% OFF"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Image URL</Label>
          <Input
            placeholder="https://picsum.photos/..."
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.image}
            onChange={(e) => update({ image: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Link</Label>
          <Input
            placeholder="/shop/summer"
            className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
            value={data.link}
            onChange={(e) => update({ link: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">Type</Label>
          <select
            className="flex h-12 w-full rounded-xl border-none bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary outline-none"
            value={data.type}
            onChange={(e) => update({ type: e.target.value })}
          >
            <option value="hero">Hero Section</option>
            <option value="promotion">Promotion Card</option>
            <option value="category">Category Header</option>
          </select>
        </div>
        <Button type="submit" className="h-12 rounded-xl font-black uppercase tracking-wider mt-auto">
          Create Banner
        </Button>
      </form>
    </div>
  );
}
