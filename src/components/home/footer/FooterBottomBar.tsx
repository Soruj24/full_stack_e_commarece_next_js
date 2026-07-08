"use client";

import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/data/footer";
import { useSettings } from "@/modules/settings/context/SettingsContext";

export function FooterBottomBar() {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-slate-600 text-xs font-medium text-center md:text-left">
        &copy; {currentYear} {settings?.siteName || "Shop"}. All rights reserved. Made with &hearts; for premium shoppers.
      </p>
      <div className="flex flex-wrap justify-center gap-6">
        {LEGAL_LINKS.map((link) => (
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
  );
}
