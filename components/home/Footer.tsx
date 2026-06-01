"use client";

import Link from "next/link";
import {
  Twitter,
  Github,
  Instagram,
  Youtube,
  ShoppingBag,
  Mail,
  MapPin,
  Phone,
  Truck,
  RefreshCw,
  Shield,
  HeadphonesIcon,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const paymentIcons = ["VISA", "MC", "AMEX", "PayPal", "Apple", "GPay"];

export function Footer() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050508 0%, #030305 100%)" }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 30%, rgba(232,121,249,0.5) 70%, transparent 100%)",
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Trust features strip */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: "Free Shipping", desc: "On orders over $50", color: "#818cf8" },
              { icon: RefreshCw, label: "Easy Returns", desc: "30-day return policy", color: "#34d399" },
              { icon: Shield, label: "Secure Payment", desc: "SSL encrypted checkout", color: "#fbbf24" },
              { icon: HeadphonesIcon, label: "24/7 Support", desc: "Always here to help", color: "#f472b6" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3.5">
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{feature.label}</p>
                  <p className="text-slate-500 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div
                className="relative h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)",
                }}
              >
                <ShoppingBag className="text-white h-6 w-6" />
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
                  {settings?.siteName?.split(" ")[0] || "Shop"}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.35em] leading-none mt-1" style={{ color: "#a78bfa" }}>
                  {settings?.siteName?.split(" ").slice(1).join(" ") || "Premium Store"}
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your trusted destination for premium products. Fast shipping, secure payments, and exceptional customer service since 2020.
            </p>

            {/* Social links */}
            <div className="flex gap-2.5">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Github, label: "GitHub" },
                { icon: Youtube, label: "YouTube" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href="#"
                  aria-label={social.label}
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(148, 163, 184, 0.7)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139, 92, 246, 0.2)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(139, 92, 246, 0.4)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "#a78bfa";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(148, 163, 184, 0.7)";
                  }}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">
              Shop
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "All Products", href: "/products" },
                { label: "New Arrivals", href: "/products?sort=newest" },
                { label: "Best Sellers", href: "/products?sort=bestselling" },
                { label: "Sale Items", href: "/products?sale=true" },
                { label: "Gift Cards", href: "/gift-cards" },
                { label: "Bundles", href: "/bundles" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">
              Support
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
                { label: "Returns & Refunds", href: "/returns" },
                { label: "Track Order", href: "/track-order" },
                { label: "Support Tickets", href: "/support/tickets" },
                { label: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-violet-400 text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                <span>123 Commerce Street,<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-violet-500 shrink-0" />
                <a href="mailto:support@shop.com" className="text-slate-400 hover:text-violet-400 transition-colors">
                  support@shop.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-violet-500 shrink-0" />
                <a href="tel:+15551234567" className="text-slate-400 hover:text-violet-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 text-xs font-semibold">Live support available</span>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6">
              <Link
                href="/register"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold text-white w-full"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                }}
              >
                <Zap className="w-4 h-4 text-violet-400" />
                Get $10 off your first order
              </Link>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div
          className="py-6 mb-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
              Secure Payment Methods
            </p>
            <div className="flex flex-wrap gap-2">
              {paymentIcons.map((p) => (
                <div
                  key={p}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-wider"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs font-medium text-center md:text-left">
            © {currentYear} {settings?.siteName || "Shop"}. All rights reserved. Made with ❤️ for premium shoppers.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookie-policy" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-bold text-slate-600 hover:text-violet-400 transition-colors uppercase tracking-wider"
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
