"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Bell, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sidebarGroups } from "@/lib/data/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = sidebarGroups.flatMap((g) => g.items);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border/60 z-50 px-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(true)}>
          <LayoutDashboard className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Admin Panel</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </Button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border/60 z-50 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-border/60">
          {!collapsed && (
            <Link href="/admin/dashboard" className="text-sm font-semibold">
              Nexus Admin
            </Link>
          )}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 hidden lg:flex" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={() => setMobileOpen(false)}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100%-3.5rem-2.75rem)] no-scrollbar">
          {allLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  collapsed && "justify-center px-2"
                )}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{link.title}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border/60">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors",
              collapsed && "justify-center px-2"
            )}
          >
            <span className="h-4 w-4 shrink-0">←</span>
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn("min-h-screen transition-all duration-300 pt-14 lg:pt-0", collapsed ? "lg:pl-[68px]" : "lg:pl-60")}>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
