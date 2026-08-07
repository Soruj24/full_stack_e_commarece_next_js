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
      <div className="relative">
        <button
          onClick={() => setMegaMenuOpen(!megaMenuOpen)}
          onMouseEnter={() => setMegaMenuOpen(true)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors",
            megaMenuOpen ? "text-foreground bg-accent/50" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          )}
          aria-expanded={megaMenuOpen}
          aria-haspopup="true"
        >
          Shop
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200 opacity-50", megaMenuOpen && "rotate-180")} />
        </button>
      </div>

      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
