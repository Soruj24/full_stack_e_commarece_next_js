"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useSettings } from "@/modules/settings/context/SettingsContext";

export function NavLogo() {
  const { settings } = useSettings();
  const name = settings?.siteName?.split(" ")[0] || "Nexus";
  const sub = settings?.siteName?.split(" ").slice(1).join(" ") || "Store";

  return (
    <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label={`${name} Home`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-foreground text-background transition-transform duration-300 group-hover:scale-[1.03]">
        {settings?.logo ? (
          <img src={settings.logo} alt={name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <ShieldCheck className="w-5 h-5" />
        )}
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="text-[17px] font-semibold tracking-tight text-foreground">{name}</span>
        <span className="text-[10px] font-medium text-muted-foreground tracking-wide mt-px">{sub}</span>
      </div>
    </Link>
  );
}
