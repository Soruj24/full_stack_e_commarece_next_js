"use client";

import { usePathname } from "next/navigation";
import { UtilityBar } from "./UtilityBar";
import { MainHeader } from "./MainHeader";

export function Header() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="w-full relative z-50">
      <UtilityBar />
      <MainHeader />
    </header>
  );
}
