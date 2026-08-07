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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={close}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[340px] bg-background z-50 flex flex-col shadow-2xl border-l border-border/40"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-border/40 shrink-0">
              <Link href="/" onClick={close} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-background" />
                </div>
                <span className="text-[14px] font-semibold tracking-tight">
                  {settings?.siteName?.split(" ")[0] || "Nexus"}
                </span>
              </Link>
              <button onClick={close} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-accent transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 py-3 border-b border-border/40">
              <ProductSearch />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="py-2 px-2">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={close}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors",
                        active ? "bg-primary/5 text-primary" : "text-foreground hover:bg-accent/50",
                      )}>
                      <span className="text-[13px] font-medium">{item.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
                    </Link>
                  );
                })}
              </div>

              {categories.length > 0 && (
                <div className="px-2 pb-3">
                  <div className="px-3 mb-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">Categories</span>
                  </div>
                  {categories.filter((c) => c.parent == null).slice(0, 6).map((cat) => {
                    const isExpanded = expandedCat === cat._id;
                    const hasChildren = cat.children && cat.children.length > 0;
                    return (
                      <div key={cat._id}>
                        <div className="flex items-center">
                          <Link href={`/products?category=${cat.slug}`} onClick={close}
                            className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-primary text-[10px] font-semibold">{cat.name[0]}</span>
                            </div>
                            <span className="text-[12px] font-medium text-foreground truncate">{cat.name}</span>
                          </Link>
                          {hasChildren && (
                            <button
                              onClick={() => setExpandedCat(isExpanded ? null : cat._id)}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-accent/50 transition-colors"
                              aria-label={`Expand ${cat.name}`}
                            >
                              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
                            </button>
                          )}
                        </div>
                        <AnimatePresence>
                          {isExpanded && hasChildren && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="overflow-hidden pl-10 pr-2"
                            >
                              {cat.children!.map((sub) => (
                                <Link key={sub._id} href={`/products?category=${sub.slug}`} onClick={close}
                                  className="block px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/30">
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

            <div className="border-t border-border/40 px-4 py-3 shrink-0">
              {user ? (
                <div className="flex items-center justify-between">
                  <Link href="/dashboard" onClick={close} className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                        {user?.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-[12px] font-medium text-foreground block">{user?.name}</span>
                      <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-0.5">
                    {isAdmin && (
                      <Link href="/admin/dashboard" onClick={close} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
                        <LayoutDashboard className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    )}
                    <button onClick={() => { onLogout(); close(); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/5 transition-colors" aria-label="Sign out">
                      <LogOut className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1 h-10 rounded-lg text-[12px] font-medium">
                    <Link href="/login" onClick={close}>Sign In</Link>
                  </Button>
                  <Button asChild className="flex-1 h-10 rounded-lg text-[12px] font-medium">
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
