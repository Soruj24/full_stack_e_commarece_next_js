"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function NavLogo() {
  const { settings } = useSettings();

  return (
    <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group relative">
      <div className="relative h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden">
        {settings?.logo ? (
          <img
            src={settings.logo}
            alt={settings.siteName}
            className="h-full w-full object-cover"
          />
        ) : (
          <ShieldCheck className="text-primary-foreground h-4 w-4 sm:h-7 sm:w-7" />
        )}
        <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm sm:text-2xl font-black tracking-tighter text-foreground uppercase italic leading-none">
          {settings?.siteName
            ? settings.siteName.split(" ")[0]
            : "Nexus"}
        </span>
        <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary leading-none mt-0.5 sm:mt-1">
          {settings?.siteName
            ? settings.siteName.split(" ").slice(1).join(" ")
            : "Identity"}
        </span>
      </div>
    </Link>
  );
}
