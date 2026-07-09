"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, ShoppingBag, Package, Heart, MapPin, CreditCard,
  Bell, Settings, Shield, User, Download, FileText, RotateCcw,
  HelpCircle, Menu, X, ChevronRight, LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Shopping",
    items: [
      { label: "Order History", href: "/dashboard/orders", icon: ShoppingBag },
      { label: "Track Orders", href: "/dashboard/tracking", icon: Package },
      { label: "My Wishlist", href: "/dashboard/wishlist", icon: Heart },
      { label: "Returns", href: "/dashboard/returns", icon: RotateCcw },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "My Profile", href: "/dashboard/profile", icon: User },
      { label: "Addresses", href: "/dashboard/addresses", icon: MapPin },
      { label: "Payment Methods", href: "/dashboard/payments", icon: CreditCard },
      { label: "Security", href: "/dashboard/security", icon: Shield },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { label: "Downloads", href: "/dashboard/downloads", icon: Download },
    ],
  },
  {
    label: "Activity",
    items: [
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Support Tickets", href: "/dashboard/support/tickets", icon: HelpCircle },
      { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    router.push("/login?redirect=/dashboard");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border/50 transition-all duration-300 sticky top-0 h-screen overflow-hidden",
          collapsed ? "w-20" : "w-72"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-lg">N</span>
            </div>
            {!collapsed && (
              <div>
                <h3 className="font-black text-sm tracking-tight">Nexus</h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Customer Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-xl hover:bg-muted transition-colors",
              collapsed && "hidden"
            )}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6 no-scrollbar scroll-smooth">
          {sidebarSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 group",
                        collapsed && "justify-center px-2",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                      {!collapsed && (
                        <span className="text-sm truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={cn("p-3 border-t border-border/50", collapsed && "flex flex-col items-center")}>
          <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-muted/50", collapsed && "justify-center p-2")}>
            <Avatar className="w-9 h-9 rounded-xl border-2 border-background shrink-0">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-sm font-bold rounded-xl">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{session.user.name || "User"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full mt-2 px-3 py-2.5 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card z-50 lg:hidden shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">N</span>
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Nexus</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-6 no-scrollbar">
                {sidebarSections.map((section) => (
                  <div key={section.label}>
                    <p className="px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
                      {section.label}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                            )}
                          >
                            <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                            <span className="text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
                  <Avatar className="w-9 h-9 rounded-xl border-2 border-background shrink-0">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-primary-foreground text-sm font-bold rounded-xl">
                      {session.user.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{session.user.name || "User"}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 w-full mt-2 px-3 py-2.5 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 lg:hidden bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-black text-sm">Dashboard</span>
            </div>
            <Avatar className="w-9 h-9 rounded-xl border-2 border-border">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="bg-muted text-xs font-bold">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
