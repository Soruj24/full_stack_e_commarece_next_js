"use client";

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductSearch } from "@/components/products/ProductSearch";
import { useSettings } from "@/modules/settings/context/SettingsContext";
import { ICategory } from "@/shared/types";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user?: { name?: string | null; email?: string | null; image?: string | null; role?: string } | null;
  isAdmin: boolean;
  pathname: string;
  categories: ICategory[];
  onLogout: () => void;
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop All", href: "/products" },
  { name: "New Arrivals", href: "/products?sort=newest" },
  { name: "Deals", href: "/products?sale=true" },
  { name: "Collections", href: "/products?sort=bestselling" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const MobileNav = memo(function MobileNav({
  open, onOpenChange, user, isAdmin, pathname, categories, onLogout,
}: MobileNavProps) {
  const { settings } = useSettings();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const close = () => onOpenChange(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={close}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[380px] bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-border/30 shrink-0">
              <Link href="/" onClick={close} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-background" />
                </div>
                <span className="text-[15px] font-semibold tracking-tight">
                  {settings?.siteName?.split(" ")[0] || "Nexus"}
                </span>
              </Link>
              <button onClick={close} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-border/20">
              <ProductSearch />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Nav items */}
              <div className="py-2 px-3">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={close}
                      className={cn(
                        "flex items-center justify-between px-3 py-3 rounded-xl transition-colors",
                        active ? "bg-primary/5 text-primary" : "text-foreground hover:bg-muted/40",
                      )}>
                      <span className="text-[14px] font-medium">{item.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                    </Link>
                  );
                })}
              </div>

              {/* Categories accordion */}
              {categories.length > 0 && (
                <div className="px-3 pb-4">
                  <div className="px-3 mb-2">
                    <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">Categories</span>
                  </div>
                  {categories.filter((c) => c.parent == null).slice(0, 6).map((cat) => {
                    const isExpanded = expandedCat === cat._id;
                    const hasChildren = cat.children && cat.children.length > 0;
                    return (
                      <div key={cat._id}>
                        <div className="flex items-center">
                          <Link href={`/products?category=${cat.slug}`} onClick={close}
                            className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-primary text-[11px] font-semibold">{cat.name[0]}</span>
                            </div>
                            <span className="text-[13px] font-medium text-foreground truncate">{cat.name}</span>
                          </Link>
                          {hasChildren && (
                            <button
                              onClick={() => setExpandedCat(isExpanded ? null : cat._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/40 transition-colors"
                              aria-label={`Expand ${cat.name}`}
                            >
                              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {isExpanded && hasChildren && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-12 pr-3"
                            >
                              {cat.children!.map((sub) => (
                                <Link key={sub._id} href={`/products?category=${sub.slug}`} onClick={close}
                                  className="block px-3 py-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30">
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/30 px-5 py-4 shrink-0">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link href="/dashboard" onClick={close} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                        {user?.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-[13px] font-medium text-foreground block">{user?.name}</span>
                      <span className="text-[11px] text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    {isAdmin && (
                      <Link href="/admin/dashboard" onClick={close} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    )}
                    <button onClick={() => { onLogout(); close(); }} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-500/5 transition-colors" aria-label="Sign out">
                      <LogOut className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button asChild variant="outline" className="flex-1 h-11 rounded-xl text-[13px] font-medium">
                    <Link href="/login" onClick={close}>Sign In</Link>
                  </Button>
                  <Button asChild className="flex-1 h-11 rounded-xl text-[13px] font-medium bg-foreground text-background">
                    <Link href="/register" onClick={close}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
