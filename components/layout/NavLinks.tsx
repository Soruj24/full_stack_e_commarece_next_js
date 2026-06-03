"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CategoriesDropdown } from "./CategoriesDropdown";

interface NavLinksProps {
  pathname: string;
  megaMenuOpen: boolean;
  setMegaMenuOpen: (open: boolean) => void;
}

export function NavLinks({ pathname, megaMenuOpen, setMegaMenuOpen }: NavLinksProps) {
  const navItemClass = (isActive: boolean) =>
    cn(
      "text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group py-2",
      isActive ? "text-primary" : "text-muted-foreground",
    );

  const activeBar = (isActive: boolean) => (
    <motion.span
      className={cn(
        "absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full",
        isActive ? "w-full" : "w-0",
      )}
    />
  );

  return (
    <div className="hidden lg:flex items-center gap-10">
      <Link
        href="/"
        className={navItemClass(pathname === "/")}
      >
        <span className="relative z-10">Home</span>
        {activeBar(pathname === "/")}
      </Link>

      <div className="relative">
        <button
          onClick={() => setMegaMenuOpen(!megaMenuOpen)}
          className={cn(
            navItemClass(megaMenuOpen || pathname.startsWith("/products") || pathname.startsWith("/categories")),
            "flex items-center gap-1",
          )}
        >
          <span className="relative z-10">Shop</span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", megaMenuOpen && "rotate-180")} />
          {activeBar(megaMenuOpen || pathname.startsWith("/products") || pathname.startsWith("/categories"))}
        </button>

        {megaMenuOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50">
            <CategoriesDropdown isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
          </div>
        )}
      </div>

      <Link
        href="/about"
        className={navItemClass(pathname === "/about")}
      >
        <span className="relative z-10">About Us</span>
        {activeBar(pathname === "/about")}
      </Link>

      <Link
        href="/contact"
        className={navItemClass(pathname === "/contact")}
      >
        <span className="relative z-10">Contact</span>
        {activeBar(pathname === "/contact")}
      </Link>
    </div>
  );
}
