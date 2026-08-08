"use client";

import { FooterTrustFeatures } from "./footer/FooterTrustFeatures";
import { FooterBrand } from "./footer/FooterBrand";
import { FooterLinkColumn } from "./footer/FooterLinkColumn";
import { FooterContact } from "./footer/FooterContact";
import { FooterPaymentMethods } from "./footer/FooterPaymentMethods";
import { FooterBottomBar } from "./footer/FooterBottomBar";
import { SHOP_LINKS, SUPPORT_LINKS } from "@/lib/data/footer";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/40 safe-area-bottom">
      <FooterTrustFeatures />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          <FooterBrand />
          <FooterLinkColumn title="Shop" links={SHOP_LINKS} />
          <FooterLinkColumn title="Support" links={SUPPORT_LINKS} />
          <FooterContact />
        </div>

        <FooterPaymentMethods />
        <FooterBottomBar />
      </div>
    </footer>
  );
}
