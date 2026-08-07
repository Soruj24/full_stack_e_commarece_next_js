"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/data/footer";
import { useSettings } from "@/modules/settings/context/SettingsContext";

export function FooterBrand() {
  const { settings } = useSettings();
  return (
    <div className="lg:col-span-2 space-y-5">
      <Link href="/" className="flex items-center gap-2.5 group w-fit">
        <div className="relative h-9 w-9 rounded-lg bg-foreground flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
          <ShoppingBag className="text-background h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[17px] font-semibold tracking-tight text-foreground leading-none">
            {settings?.siteName?.split(" ")[0] || "Shop"}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide mt-0.5">
            {settings?.siteName?.split(" ").slice(1).join(" ") || "Premium Store"}
          </span>
        </div>
      </Link>

      <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
        Your trusted destination for premium products. Fast shipping, secure payments, and exceptional customer service.
      </p>

      <div className="flex gap-1.5">
        {SOCIAL_LINKS.map((social, index) => (
          <Link
            key={index}
            href="#"
            aria-label={social.label}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <social.icon className="w-4 h-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}
