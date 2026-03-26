import { auth } from "@/auth";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CTASection } from "@/components/home/CTASection";
import { DynamicBanners } from "@/components/home/DynamicBanners";
import { EcommerceHero } from "@/components/home/EcommerceHero";
import { FAQSection } from "@/components/home/FAQSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FlashSale } from "@/components/home/FlashSale";
import { Footer } from "@/components/home/Footer";
import { Newsletter } from "@/components/home/Newsletter";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { AllProducts } from "@/components/home/AllProducts";
import { TrustSection } from "@/components/home/TrustSection";
import { ProductRecommendations } from "@/components/products/ProductRecommendations";
import { RecentlyViewedProducts } from "@/components/products/RecentlyViewedProducts";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { BrandsSection } from "@/components/home/BrandsSection";

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
