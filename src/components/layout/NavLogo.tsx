"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useSettings } from "@/modules/settings/context/SettingsContext";

export function NavLogo() {
  const { settings } = useSettings();
  const name = settings?.siteName?.split(" ")[0] || "Nexus";
  const sub = settings?.siteName?.split(" ").slice(1).join(" ") || "Store";

  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 shrink-0 group focus-premium rounded-lg"
      aria-label={`${name} Home`}
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background transition-all duration-200 group-hover:shadow-md group-hover:shadow-foreground/10">
        {settings?.logo ? (
          <img
            src={settings.logo}
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
        )}
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          {name}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground tracking-wide mt-px">
          {sub}
        </span>
      </div>
    </Link>
  );
}
