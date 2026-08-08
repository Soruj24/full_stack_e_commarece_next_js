"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Bell,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { sidebarGroups } from "@/lib/data/admin-sidebar";
import type { SidebarGroup, SidebarItem } from "@/lib/data/admin-sidebar";
import { ChevronRight, ExternalLink, Search } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    return new Set(
      sidebarGroups.filter((g) => g.defaultOpen).map((g) => g.label)
    );
  });

  const toggleGroup = useCallback((label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  useEffect(() => {
    const activeGroup = sidebarGroups.find((g) =>
      g.items.some(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
      )
    );
    if (activeGroup) {
      setOpenGroups((prev) => new Set([...prev, activeGroup.label]));
    }
  }, [pathname]);

  const handleNavigate = useCallback(() => setMobileOpen(false), []);

  const isActive = (item: SidebarItem) =>
    pathname === item.href || pathname.startsWith(item.href + "/");

  const isGroupActive = (group: SidebarGroup) =>
    group.items.some((item) => isActive(item));

  return (
    <TooltipProvider delayDuration={0}>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border/60 z-50 px-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(true)}>
            <span className="sr-only">Open menu</span>
            <div className="flex flex-col gap-1">
              <span className="block w-4 h-0.5 bg-foreground" />
              <span className="block w-4 h-0.5 bg-foreground" />
              <span className="block w-4 h-0.5 bg-foreground" />
            </div>
          </Button>
          <span className="text-sm font-medium">Admin Panel</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </Button>
        </header>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={handleNavigate}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 h-full bg-card border-r border-border/60 z-50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            collapsed ? "w-[68px]" : "w-60",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Logo */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-border/60">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden" onClick={handleNavigate}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <span className="text-primary-foreground text-sm font-bold">N</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight text-foreground leading-none">Nexus</span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin</span>
                </div>
              )}
            </Link>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 hidden lg:flex" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={handleNavigate}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          {!collapsed && (
            <div className="px-3 pt-3 pb-2">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground bg-muted/40 rounded-md border border-border/60 hover:border-border hover:bg-muted/60 transition-colors"
                onClick={handleNavigate}
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Search...</span>
                <kbd className="ml-auto text-[10px] text-muted-foreground/50 bg-background border border-border/60 rounded px-1 py-0.5 font-mono leading-none">⌘K</kbd>
              </Link>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 px-2 no-scrollbar" style={{ height: "calc(100vh - 3.5rem - 3rem)" }}>
            {sidebarGroups.map((group) => {
              const groupActive = isGroupActive(group);
              const isOpen = openGroups.has(group.label);
              const isSingleItem = group.items.length === 1;

              if (isSingleItem) {
                const item = group.items[0];
                const active = isActive(item);
                return (
                  <div key={group.label} className="mb-0.5">
                    <SidebarLink item={item} active={active} collapsed={collapsed} onClick={handleNavigate} />
                  </div>
                );
              }

              return (
                <div key={group.label} className="mb-0.5">
                  <Collapsible open={isOpen} onOpenChange={() => toggleGroup(group.label)}>
                    <CollapsiblePrimitive.CollapsibleTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center w-full gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors group",
                          groupActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                      >
                        <group.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left text-[13px] font-medium truncate">{group.label}</span>
                            <ChevronRight className={cn("w-3.5 h-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-200", isOpen && "rotate-90")} />
                          </>
                        )}
                      </button>
                    </CollapsiblePrimitive.CollapsibleTrigger>
                    {!collapsed && (
                      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200">
                        <div className="ml-4 pl-3 border-l border-border/60 py-0.5 space-y-0.5">
                          {group.items.map((item) => (
                            <SidebarLink key={item.href} item={item} active={isActive(item)} collapsed={false} onClick={handleNavigate} />
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-2 py-2 border-t border-border/60 space-y-0.5">
            <SidebarLink
              item={{ title: "Back to Store", href: "/", icon: ExternalLink }}
              active={false}
              collapsed={collapsed}
              onClick={handleNavigate}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn("min-h-screen transition-all duration-300 pt-14 lg:pt-0", collapsed ? "lg:pl-[68px]" : "lg:pl-60")}>
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  );
}

/* ── Sidebar Link ───────────────────────────────────────── */

function SidebarLink({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: SidebarItem;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const link = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-all duration-150 group relative",
        active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
        collapsed && "justify-center px-2"
      )}
      tabIndex={0}
      aria-current={active ? "page" : undefined}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-full" />}
      <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {item.badge !== undefined && <SidebarBadge value={item.badge} variant={item.badgeVariant} />}
        </>
      )}
      {collapsed && item.badge !== undefined && (
        <div className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold px-1">
          {item.badge}
        </div>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10}>{item.title}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

/* ── Badge ──────────────────────────────────────────────── */

function SidebarBadge({ value, variant = "default" }: { value: string | number; variant?: "default" | "success" | "warning" | "danger" }) {
  const styles = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    danger: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={cn("inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-semibold leading-none", styles[variant])}>
      {value}
    </span>
  );
}
