"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFallbackImage } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Package } from "lucide-react";
import Image from "next/image";
import { IBanner } from "@/types";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: IBanner | null;
  onSuccess: () => void;
}

export function AdminBannerDialog({
  open,
  onOpenChange,
  banner,
  onSuccess,
}: BannerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    type: "promotion",
    isActive: true,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        image: banner.image,
        link: banner.link || "",
        type: banner.type,
        isActive: banner.isActive,
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        type: "promotion",
        isActive: true,
      });
    }
  }, [banner, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = banner
        ? `/api/admin/marketing/banners/${banner._id}`
        : "/api/admin/marketing/banners";
      const method = banner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(banner ? "Banner updated" : "Banner created");
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[40px] p-10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-black tracking-tighter">
            {banner ? "Edit" : "Add New"}{" "}
            <span className="text-primary">Banner</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Title
              </Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Summer Sale"
                className="h-14 rounded-2xl bg-muted/50 border-border/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Subtitle
              </Label>
              <Input
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Ex: Up to 50% Off"
                className="h-14 rounded-2xl bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Image URL
            </Label>
            <Input
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://..."
              className="h-14 rounded-2xl bg-muted/50 border-border/50"
              required
            />
            {formData.image && formData.image.trim() !== "" && (
              <div className="mt-4 relative aspect-video rounded-2xl overflow-hidden border border-border/50">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage();
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Link URL
              </Label>
              <Input
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="/products/..."
                className="h-14 rounded-2xl bg-muted/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
              >
                <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border/50">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border border-border/50">
            <div className="flex-1">
              <h4 className="font-bold">Active Status</h4>
              <p className="text-sm text-muted-foreground">
                Enable this banner to show it on the site.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-6 h-6 rounded-lg accent-primary"
            />
          </div>

          <DialogFooter className="pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 gap-3"
            >
              {loading
                ? "Saving..."
                : banner
                  ? "Update Banner"
                  : "Create Banner"}
              <Package className="w-5 h-5" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
