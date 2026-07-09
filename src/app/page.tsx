export const revalidate = 60;

import dynamic from "next/dynamic";
import { auth } from "@/lib/auth";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EcommerceHero } from "@/components/home/EcommerceHero";
import { Footer } from "@/components/home/Footer";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustSection } from "@/components/home/TrustSection";
import { StatsSection } from "@/components/home/StatsSection";
import { BrandsSection } from "@/components/home/BrandsSection";

const FlashSale = dynamic(() => import("@/components/home/FlashSale").then(mod => ({ default: mod.FlashSale })), {
  loading: () => <div className="h-[200px] bg-muted/20 animate-pulse rounded-2xl" />,
});

const TrendingProducts = dynamic(() => import("@/components/home/TrendingProducts").then(mod => ({ default: mod.TrendingProducts })), {
  loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-2xl" />,
});

const AllProducts = dynamic(() => import("@/components/home/AllProducts").then(mod => ({ default: mod.AllProducts })), {
  loading: () => <div className="h-[600px] bg-muted/20 animate-pulse rounded-2xl" />,
});

const CTASection = dynamic(() => import("@/components/home/CTASection").then(mod => ({ default: mod.CTASection })));
const DynamicBanners = dynamic(() => import("@/components/home/DynamicBanners").then(mod => ({ default: mod.DynamicBanners })));
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection").then(mod => ({ default: mod.FeaturesSection })));
const FAQSection = dynamic(() => import("@/components/home/FAQSection").then(mod => ({ default: mod.FAQSection })));
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection").then(mod => ({ default: mod.HowItWorksSection })));
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection").then(mod => ({ default: mod.TestimonialsSection })));
const ProductRecommendations = dynamic(() => import("@/components/products/ProductRecommendations").then(mod => ({ default: mod.ProductRecommendations })));
const RecentlyViewedProducts = dynamic(() => import("@/components/products/RecentlyViewedProducts").then(mod => ({ default: mod.RecentlyViewedProducts })));

export default async function HomePage() {
  const session = await auth();
  const saleEndTime = new Date();
  saleEndTime.setHours(saleEndTime.getHours() + 24);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EcommerceHero />
      <BrandsSection />
      <CategoryGrid />
      <StatsSection />

      <div className="container mx-auto px-2 py-5">
        <FlashSale endTime={saleEndTime} />
      </div>

      <HowItWorksSection />
      <TrendingProducts />
      <DynamicBanners />
      <AllProducts />
      <TestimonialsSection />

      <div className="bg-muted/30 py-5">
        <ProductRecommendations />
      </div>

      <div id="recently-viewed" className="container mx-auto px-4 py-16">
        <RecentlyViewedProducts
          title="Recently Viewed Products"
          maxProducts={6}
          showClearButton
        />
      </div>

      <TrustSection />
      <Newsletter />
      <FeaturesSection />

      <div className="py-5">
        <FAQSection />
      </div>

      {!session && <CTASection />}
      <Footer />
    </div>
  );
}
