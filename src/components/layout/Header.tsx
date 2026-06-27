"use client";

import { TopNav } from "./TopNav";
import Navbar from "./Navbar";
import { AnnouncementBar } from "./AnnouncementBar";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="w-full">
      <AnnouncementBar />
      <TopNav />
      <Navbar />
    </header>
  );
}
