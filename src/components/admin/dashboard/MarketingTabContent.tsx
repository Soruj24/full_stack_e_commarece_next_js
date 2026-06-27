"use client";

import { useMarketing } from "@/features/admin/hooks/use-marketing";
import { BannerSection } from "./marketing/BannerSection";
import { CouponSection } from "./marketing/CouponSection";
import { FlashSalesSection } from "./marketing/FlashSalesSection";

export function MarketingTabContent() {
  const {
    coupons, banners, products, loading, saleLoading,
    showAddCoupon, setShowAddCoupon,
    showAddBanner, setShowAddBanner,
    newCoupon, setNewCoupon,
    newBanner, setNewBanner,
    handleAddBanner, handleDeleteBanner, handleToggleBannerStatus,
    handleAddCoupon, handleDeleteCoupon, handleToggleCouponStatus,
    handleToggleSale,
  } = useMarketing();

  return (
    <div className="space-y-8">
      <BannerSection
        banners={banners}
        showAdd={showAddBanner}
        newBanner={newBanner}
        onToggleShow={() => setShowAddBanner(!showAddBanner)}
        onNewBannerChange={setNewBanner}
        onAdd={handleAddBanner}
        onDelete={handleDeleteBanner}
        onToggleStatus={handleToggleBannerStatus}
      />

      <CouponSection
        coupons={coupons}
        loading={loading}
        showAdd={showAddCoupon}
        newCoupon={newCoupon}
        onToggleShow={() => setShowAddCoupon(!showAddCoupon)}
        onNewCouponChange={setNewCoupon}
        onAdd={handleAddCoupon}
        onToggleStatus={handleToggleCouponStatus}
        onDelete={handleDeleteCoupon}
      />

      <FlashSalesSection
        products={products}
        saleLoading={saleLoading}
        onToggleSale={handleToggleSale}
      />
    </div>
  );
}
