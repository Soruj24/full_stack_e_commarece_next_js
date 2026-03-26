"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Tag,
  Megaphone,
  Calendar,
  Percent,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minPurchase: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
}

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
  type: string;
}

export function MarketingTabContent() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: 0,
    minPurchase: 0,
    expiryDate: "",
    usageLimit: 0,
  });

  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    type: "promotion",
  });

  interface Product {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    onSale?: boolean;
    images?: string[];
    category?: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [saleLoading, setSaleLoading] = useState(false);

  const fetchMarketingData = async () => {
    try {
      const [couponsRes, bannersRes, productsRes] = await Promise.all([
        fetch("/api/admin/marketing/coupons"),
        fetch("/api/admin/marketing/banners"),
        fetch("/api/products?limit=100"),
      ]);

      const couponsData = await couponsRes.json();
      const bannersData = await bannersRes.json();
      const productsData = await productsRes.json();

      if (couponsData.success) setCoupons(couponsData.coupons);
      if (bannersData.success) setBanners(bannersData.banners);
      if (productsData.success) setProducts(productsData.products);
    } catch (error) {
      toast.error("Failed to fetch marketing data");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaleStatus = async (
    productId: string,
    onSale: boolean,
    discountPrice?: number,
  ) => {
    setSaleLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onSale, discountPrice }),
      });
      if (res.ok) {
        toast.success(
          onSale ? "Product added to sale" : "Product removed from sale",
        );
        fetchMarketingData();
      }
    } catch (error) {
      toast.error("Failed to update sale status");
    } finally {
      setSaleLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/marketing/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Banner created successfully");
        setShowAddBanner(false);
        fetchMarketingData();
        setNewBanner({
          title: "",
          subtitle: "",
          image: "",
          link: "",
          type: "promotion",
        });
      }
    } catch (error) {
      toast.error("Error creating banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/banners?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Banner deleted");
        fetchMarketingData();
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/marketing/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchMarketingData();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/marketing/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Coupon created successfully");
        setShowAddCoupon(false);
        fetchMarketingData();
        setNewCoupon({
          code: "",
          discountType: "percentage",
          discountAmount: 0,
          minPurchase: 0,
          expiryDate: "",
          usageLimit: 0,
        });
      } else {
        toast.error(data.error || "Failed to create coupon");
      }
    } catch (error) {
      toast.error("Error creating coupon");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/coupons?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Coupon deleted");
        fetchMarketingData();
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/marketing/coupons`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchMarketingData();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Promotion Banners Section */}
      <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <CardHeader className="py-8 px-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-primary flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Megaphone className="h-6 w-6 text-primary" />
              </div>
              Promotion Banners
            </CardTitle>
            <Button
              onClick={() => setShowAddBanner(!showAddBanner)}
              variant={showAddBanner ? "outline" : "default"}
              className="rounded-2xl font-bold px-6 py-6 h-auto shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              {showAddBanner ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Banner
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          {showAddBanner && (
            <div className="mb-10 p-8 bg-muted/30 rounded-[32px] border border-border/50 animate-in slide-in-from-top duration-300">
              <form
                onSubmit={handleAddBanner}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Title
                  </Label>
                  <Input
                    placeholder="Summer Sale 2025"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newBanner.title}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Subtitle
                  </Label>
                  <Input
                    placeholder="Up to 50% OFF"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newBanner.subtitle}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, subtitle: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Image URL
                  </Label>
                  <Input
                    placeholder="https://picsum.photos/..."
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newBanner.image}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, image: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Link
                  </Label>
                  <Input
                    placeholder="/shop/summer"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newBanner.link}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, link: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Type
                  </Label>
                  <select
                    className="flex h-12 w-full rounded-xl border-none bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary outline-none"
                    value={newBanner.type}
                    onChange={(e) =>
                      setNewBanner({ ...newBanner, type: e.target.value })
                    }
                  >
                    <option value="hero">Hero Section</option>
                    <option value="promotion">Promotion Card</option>
                    <option value="category">Category Header</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  className="h-12 rounded-xl font-black uppercase tracking-wider mt-auto"
                >
                  Create Banner
                </Button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(banners || []).length === 0 ? (
              <div className="lg:col-span-3 group relative aspect-[16/5] rounded-[24px] overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center p-6 text-center transition-all hover:border-primary/50">
                <div className="p-4 bg-muted-foreground/10 rounded-full mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="font-bold text-muted-foreground/60">
                  No active banners
                </p>
                <p className="text-sm text-muted-foreground/40 mt-1">
                  Upload a banner image to start promoting
                </p>
              </div>
            ) : (
              (banners || []).map((banner) => (
                <div
                  key={banner._id}
                  className="group relative rounded-[24px] overflow-hidden bg-muted border border-border/50 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/9] relative">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-black text-lg">
                        {banner.title}
                      </p>
                      <p className="text-white/80 text-xs font-medium">
                        {banner.subtitle}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-xl h-8 w-8 bg-white/90 hover:bg-white text-destructive"
                        onClick={() => handleDeleteBanner(banner._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className={cn(
                          "rounded-xl h-8 w-8 bg-white/90 hover:bg-white",
                          banner.isActive
                            ? "text-emerald-500"
                            : "text-muted-foreground",
                        )}
                        onClick={() =>
                          toggleBannerStatus(banner._id, banner.isActive)
                        }
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="rounded-lg text-[10px] font-black uppercase tracking-widest"
                      >
                        {banner.type}
                      </Badge>
                      <Badge
                        className={cn(
                          "rounded-lg text-[10px] font-black uppercase tracking-widest",
                          banner.isActive
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
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

      {/* Coupons Section */}
      <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden">
        <CardHeader className="py-8 px-10 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-primary flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              Discount Coupons
            </CardTitle>
            <Button
              onClick={() => setShowAddCoupon(!showAddCoupon)}
              variant={showAddCoupon ? "outline" : "default"}
              className="rounded-2xl font-bold px-6 py-6 h-auto transition-all"
            >
              {showAddCoupon ? "Cancel" : "Add Coupon"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {showAddCoupon && (
            <div className="p-10 bg-muted/30 border-b border-border/50 animate-in slide-in-from-top duration-300">
              <form
                onSubmit={handleAddCoupon}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-end"
              >
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Code
                  </Label>
                  <Input
                    placeholder="SUMMER25"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold uppercase"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Type
                  </Label>
                  <select
                    className="flex h-12 w-full rounded-xl border-none bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary outline-none"
                    value={newCoupon.discountType}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountType: e.target.value 
                      })
                    }
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Value
                  </Label>
                  <Input
                    type="number"
                    placeholder="20"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newCoupon.discountAmount}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        discountAmount: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Min Purchase
                  </Label>
                  <Input
                    type="number"
                    placeholder="100"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newCoupon.minPurchase}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        minPurchase: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground ml-1 uppercase">
                    Expiry
                  </Label>
                  <Input
                    type="date"
                    className="h-12 rounded-xl border-none bg-background shadow-sm font-bold"
                    value={newCoupon.expiryDate}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 rounded-xl font-black uppercase tracking-wider"
                >
                  Create
                </Button>
              </form>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs font-bold uppercase tracking-widest border-b border-border/50">
                  <th className="py-5 px-10">Coupon Info</th>
                  <th className="py-5 px-6">Discount</th>
                  <th className="py-5 px-6">Min. Purchase</th>
                  <th className="py-5 px-6">Expiry</th>
                  <th className="py-5 px-6">Usage</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
                          Loading Coupons...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (coupons || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Tag className="h-12 w-12" />
                        <p className="font-black text-xl">No active coupons</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (coupons || []).map((coupon) => (
                    <tr
                      key={coupon._id}
                      className="group hover:bg-primary/[0.02] transition-colors"
                    >
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Percent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">
                              {coupon.code}
                            </p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              Storewide Discount
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <Badge
                          variant="outline"
                          className="rounded-xl px-3 py-1 font-black text-primary border-primary/20 bg-primary/5"
                        >
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountAmount}%`
                            : `$${coupon.discountAmount}`}
                        </Badge>
                      </td>
                      <td className="py-6 px-6 font-bold text-muted-foreground">
                        ${coupon.minPurchase}
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2 text-muted-foreground font-bold">
                          <Calendar className="h-4 w-4" />
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{
                                width: `${Math.min((coupon.usageCount / (coupon.usageLimit || 100)) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-muted-foreground">
                            {coupon.usageCount} / {coupon.usageLimit || "∞"}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <button
                          onClick={() =>
                            toggleCouponStatus(coupon._id, coupon.isActive)
                          }
                          className={cn(
                            "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                            coupon.isActive
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : "bg-destructive/10 text-destructive hover:bg-destructive/20",
                          )}
                        >
                          {coupon.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="py-6 px-10 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                            onClick={() => handleDeleteCoupon(coupon._id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Flash Sales & Promotions Section */}
      <Card className="border-none shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
        <CardHeader className="py-8 px-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black text-orange-600 flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-2xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              Flash Sales & Promotions
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-orange-500/10 text-orange-600 border-none font-black px-4 py-1.5 rounded-full"
            >
              {(products || []).filter((p) => p.onSale).length} Products on Sale
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products || []).slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="group p-5 rounded-[28px] bg-card border border-border/50 hover:border-orange-500/30 transition-all shadow-sm"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative bg-muted">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.onSale && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Sale
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="font-bold text-sm truncate">{product.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          product.onSale
                            ? "text-muted-foreground line-through"
                            : "text-primary",
                        )}
                      >
                        ${product.price.toFixed(2)}
                      </p>
                      {product.onSale && (
                        <p className="text-sm font-black text-orange-600">
                          ${product.discountPrice?.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={product.onSale ? "destructive" : "default"}
                      className={cn(
                        "rounded-xl h-9 px-4 font-black text-[10px] uppercase tracking-widest",
                        !product.onSale && "bg-orange-500 hover:bg-orange-600",
                      )}
                      onClick={() => {
                        if (product.onSale) {
                          toggleSaleStatus(product._id, false);
                        } else {
                          const discount = prompt(
                            "Enter discount price for this product:",
                            (product.price * 0.8).toFixed(2),
                          );
                          if (discount)
                            toggleSaleStatus(
                              product._id,
                              true,
                              parseFloat(discount),
                            );
                        }
                      }}
                      disabled={saleLoading}
                    >
                      {product.onSale ? "Remove" : "Add Sale"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {products.length > 8 && (
            <div className="mt-8 text-center">
              <Button
                variant="ghost"
                className="rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                View All Products <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
