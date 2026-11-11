export const revalidate = 60;

import dynamic from "next/dynamic";
import { Footer } from "@/components/home/Footer";
import { Newsletter } from "@/components/home/Newsletter";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { EcommerceHero } from "@/components/home/EcommerceHero";
import { DynamicBanners } from "@/components/home/DynamicBanners";
import { HomeAnnouncement } from "@/components/home/sections/HomeAnnouncement";
import { HomeReduxBridge } from "@/components/home/sections/HomeReduxBridge";
import { FeaturedCategoriesSection } from "@/components/home/sections/FeaturedCategoriesSection";
import { FeaturedBrandsSection } from "@/components/home/sections/FeaturedBrandsSection";
import { HomePromotionalBanner } from "@/components/home/sections/HomePromotionalBanner";
import { ProductRail } from "@/components/home/sections/ProductRail";

const FlashSale = dynamic(
  () => import("@/components/home/FlashSale").then((mod) => ({ default: mod.FlashSale })),
  { loading: () => <div className="h-[140px] bg-muted/30 animate-pulse rounded-2xl" /> }
);

export default function HomePage() {
  const saleEndTime = new Date();
  saleEndTime.setHours(saleEndTime.getHours() + 24);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HomeReduxBridge />
      <HomeAnnouncement />

      {/* 3. Hero Section */}
      <EcommerceHero />

      {/* 4. Featured Categories */}
      <FeaturedCategoriesSection />

      {/* 5. Trending Products */}
      <ProductRail
        eyebrow="Trending now"
        title="Trending Products"
        description="Most-loved picks gaining momentum across the store right now."
        query="sortBy=rating&limit=8"
        href="/products?sortBy=rating"
        ctaLabel="Shop trending"
        columns={4}
      />

      {/* 6. Best Sellers */}
      <section className="bg-surface/30 border-y border-border/40">
        <ProductRail
          eyebrow="Customer favorites"
          title="Best Sellers"
          description="Proven essentials with standout quality, performance, and reviews."
          query="sortBy=bestselling&limit=8"
          href="/products?sort=bestselling"
          ctaLabel="View best sellers"
          columns={4}
        />
      </section>

      {/* 7. Promotional Banner */}
      <HomePromotionalBanner />
      <DynamicBanners />

      {/* Flash Sale / urgency promo strip (supports special offers experience) */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FlashSale endTime={saleEndTime} />
        </div>
      </section>

      {/* 8. New Arrivals */}
      <ProductRail
        eyebrow="Just dropped"
        title="New Arrivals"
        description="Fresh arrivals and latest releases, curated for a premium shopping experience."
        query="sortBy=newest&limit=8"
        href="/products?sort=newest"
        ctaLabel="Shop new arrivals"
        columns={4}
      />

      {/* 9. Special Offers */}
      <section className="bg-surface/30 border-y border-border/40">
        <ProductRail
          eyebrow="Limited value"
          title="Special Offers"
          description="Exceptional pricing on selected products while availability lasts."
          query="sale=true&limit=8"
          href="/products?sale=true"
          ctaLabel="Shop offers"
          columns={4}
        />
      </section>

      {/* 10. Featured Brands */}
      <FeaturedBrandsSection />

      {/* 11. Customer Testimonials */}
      <TestimonialsSection />

      {/* 12. Newsletter Subscription */}
      <Newsletter />

      {/* 13. Premium Footer */}
      <Footer />
    </div>
  );
}
