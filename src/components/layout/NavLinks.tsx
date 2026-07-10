"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  pathname: string;
  megaMenuOpen: boolean;
  setMegaMenuOpen: (v: boolean) => void;
}

const links = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/products?sort=bestselling" },
  { name: "Categories", href: "/categories" },
  { name: "Brands", href: "/products?sort=brands" },
  { name: "Deals", href: "/products?sale=true" },
  { name: "New Arrivals", href: "/products?sort=newest" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.split("?")[0]);
}

export function NavLinks({ pathname, megaMenuOpen, setMegaMenuOpen }: NavLinksProps) {
  return (
    <div className="hidden lg:flex items-center gap-0.5">
      {/* Shop with mega menu */}
      <div className="relative">
        <button
          onClick={() => setMegaMenuOpen(!megaMenuOpen)}
          onMouseEnter={() => setMegaMenuOpen(true)}
          className={cn(
            "flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors relative group",
            megaMenuOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          aria-expanded={megaMenuOpen}
          aria-haspopup="true"
        >
          Shop
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", megaMenuOpen && "rotate-180")} />
          <span className={cn(
            "absolute bottom-0.5 left-3.5 right-3.5 h-[1.5px] bg-foreground rounded-full origin-left transition-transform duration-200",
            megaMenuOpen ? "scale-x-100" : "scale-x-0",
          )} />
        </button>
      </div>

      {/* Separator */}
      <span className="w-px h-4 bg-border/50 mx-1" />

      {/* Regular links */}
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "px-3 py-2 text-[13px] font-medium rounded-lg transition-colors relative group",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.name}
            <span className={cn(
              "absolute bottom-0.5 left-3 right-3 h-[1.5px] bg-foreground rounded-full origin-left transition-transform duration-200",
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            )} />
          </Link>
        );
      })}
    </div>
  );
}
