"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Github,
  Linkedin,
  ShoppingBag,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  RefreshCw,
} from "lucide-react";

import { useSettings } from "@/context/SettingsContext";
import Image from "next/image";

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/50 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2" />

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {settings?.logo ? (
                  <Image
                    src={settings.logo}
                    alt={settings.siteName}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <ShoppingBag className="text-primary-foreground h-6 w-6" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                  {settings?.siteName?.split(" ")[0] || "Shop"}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary leading-none mt-1">
                  {settings?.siteName?.split(" ").slice(1).join(" ") || "Store"}
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
              Your trusted online store for quality products. Fast shipping,
              secure payments, and excellent customer service.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Facebook, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-xs">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Shop All", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "New Arrivals", href: "/products?sort=newest" },
                { label: "Best Sellers", href: "/products?sort=bestselling" },
                { label: "Gift Cards", href: "/gift-cards" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-xs">
              Customer Service
            </h4>
            <ul className="space-y-4">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
                { label: "Returns & Refunds", href: "/returns" },
                { label: "Track Order", href: "/track-order" },
                { label: "Support", href: "/support/tickets" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 inline-block font-medium text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-foreground mb-6 uppercase tracking-widest text-xs">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground font-medium">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>
                  123 Commerce Street,
                  <br />
                  Business District, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:support@example.com"
                  className="hover:text-foreground transition-colors"
                >
                  support@example.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-foreground transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-muted/30 rounded-xl">
          {[
            { icon: Truck, label: "Free Shipping", desc: "On orders over $50" },
            { icon: RefreshCw, label: "Easy Returns", desc: "30-day return policy" },
            { icon: CreditCard, label: "Secure Payment", desc: "SSL encrypted checkout" },
            { icon: Phone, label: "24/7 Support", desc: "Always here to help" },
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-muted-foreground text-center md:text-left">
            © {currentYear} {settings?.siteName || "Shop"}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookie-policy" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
