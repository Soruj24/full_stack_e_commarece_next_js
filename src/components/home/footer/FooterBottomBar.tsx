"use client";

import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/data/footer";
import { useSettings } from "@/modules/settings/context/SettingsContext";

export function FooterBottomBar() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
      <p className="text-muted-foreground text-[11px] text-center md:text-left">
        &copy; {currentYear} {settings?.siteName || "Shop"}. All rights reserved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
