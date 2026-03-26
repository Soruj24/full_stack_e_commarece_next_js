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
import { Textarea } from "@/components/ui/textarea";
import { getFallbackImage } from "@/lib/utils";
import { toast } from "sonner";
import { Package } from "lucide-react";
import Image from "next/image";

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    website?: string;
    isActive: boolean;
  };
  onSuccess: () => void;
}

export function AdminBrandDialog({
  open,
  onOpenChange,
  brand,
  onSuccess,
}: BrandDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
    isActive: true,
  });

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        description: brand.description || "",
        logo: brand.logo || "",
        website: brand.website || "",
        isActive: brand.isActive,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        logo: "",
        website: "",
        isActive: true,
      });
    }
  }, [brand, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = brand
        ? `/api/admin/brands/${brand._id}`
        : "/api/admin/brands";
      const method = brand ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(brand ? "Brand updated" : "Brand created");
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
            {brand ? "Edit" : "Add New"}{" "}
            <span className="text-primary">Brand</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Brand Name
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Nike, Adidas"
              className="h-14 rounded-2xl bg-muted/50 border-border/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brand description..."
              className="min-h-[100px] rounded-3xl bg-muted/50 border-border/50 p-6"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Logo URL
            </Label>
            <Input
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              placeholder="https://..."
              className="h-14 rounded-2xl bg-muted/50 border-border/50"
            />
            {formData.logo && formData.logo.trim() !== "" && (
              <div className="mt-4 relative h-20 w-20 rounded-2xl overflow-hidden border border-border/50">
                <Image
                  src={formData.logo}
                  alt="Preview"
                  fill
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackImage();
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
              Website
            </Label>
            <Input
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
              className="h-14 rounded-2xl bg-muted/50 border-border/50"
            />
          </div>

          <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-3xl border border-border/50">
            <div className="flex-1">
              <h4 className="font-bold">Active Status</h4>
              <p className="text-sm text-muted-foreground">
                Enable this brand to be selectable for products.
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
                : brand
                ? "Update Brand"
                : "Create Brand"}
              <Package className="w-5 h-5" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
