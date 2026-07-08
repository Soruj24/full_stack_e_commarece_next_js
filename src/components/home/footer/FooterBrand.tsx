"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data/footer";
import { useSettings } from "@/modules/settings/context/SettingsContext";

export function FooterBrand() {
  const { settings } = useSettings();
  return (
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

      <div className="flex gap-2.5">
        {SOCIAL_LINKS.map((social, index) => (
          <Link
            key={index}
            href="#"
            aria-label={social.label}
            className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(148, 163, 184, 0.7)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139, 92, 246, 0.2)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(139, 92, 246, 0.4)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(255,255,255,0.04)";
              el.style.borderColor = "rgba(255,255,255,0.07)";
              el.style.color = "rgba(148, 163, 184, 0.7)";
            }}
          >
            <social.icon className="w-4 h-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}
