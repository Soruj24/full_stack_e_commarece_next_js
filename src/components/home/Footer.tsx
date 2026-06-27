"use client";

import { FooterGlowLine } from "./footer/FooterGlowLine";
import { FooterAmbientOrbs } from "./footer/FooterAmbientOrbs";
import { FooterTrustFeatures } from "./footer/FooterTrustFeatures";
import { FooterBrand } from "./footer/FooterBrand";
import { FooterLinkColumn } from "./footer/FooterLinkColumn";
import { FooterContact } from "./footer/FooterContact";
import { FooterPaymentMethods } from "./footer/FooterPaymentMethods";
import { FooterBottomBar } from "./footer/FooterBottomBar";
import { SHOP_LINKS, SUPPORT_LINKS } from "@/lib/data/footer";

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050508 0%, #030305 100%)" }}>
      <FooterGlowLine />
      <FooterAmbientOrbs />
      <FooterTrustFeatures />

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
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
