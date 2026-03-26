"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Inbox,
  History,
  Settings,
  ShieldCheck,
  ChevronLeft,
  Package,
  ShoppingBag,
  PieChart,
  Layers,
  Megaphone,
  Tag,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Products",
    href: "/admin/inventory",
    icon: Package,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Layers,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Brands",
    href: "/admin/brands",
    icon: Tag,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Banners",
    href: "/admin/marketing/banners",
    icon: Megaphone,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Contact Messages",
    href: "/admin/contact",
    icon: Inbox,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: History,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: PieChart,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
];

export function AdminSidebar({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out h-screen",
        isCollapsed ? "w-20" : "w-64",
        isMobile && "w-full border-r-0"
      )}
    >
      <div className="flex items-center h-24 px-6 border-b border-border/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-3 bg-primary rounded-[18px] shrink-0 shadow-lg shadow-primary/20 relative group/logo">
            <div className="absolute inset-0 bg-white/20 rounded-[18px] opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            <ShieldCheck className="w-7 h-7 text-primary-foreground relative z-10" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-foreground leading-none">
                ADMIN<span className="text-primary">HUB</span>
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Management System
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 no-scrollbar">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "bg-white/20" : cn(item.bg, item.color, "group-hover:scale-110")
              )}>
                <item.icon className="w-4.5 h-4.5 shrink-0" />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm leading-none">{item.title}</span>
                  {isActive && (
                    <span className="text-[10px] font-medium opacity-70 mt-1 uppercase tracking-wider animate-in fade-in slide-in-from-left-2 duration-500">
                      Active Now
                    </span>
                  )}
                </div>
              )}

              {isActive && !isCollapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
      
      {!isMobile && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-center rounded-xl"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>
      )}
    </aside>
  );
}
