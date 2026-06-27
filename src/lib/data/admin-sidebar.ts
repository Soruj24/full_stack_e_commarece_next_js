import {
  LayoutDashboard, Users, Package, ShoppingCart, FolderTree, Building2,
  Ticket, Megaphone, BarChart3, MessageSquare, Shield, Settings,
  ShoppingBag, Layers, Tag, Inbox, History, PieChart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Brands", href: "/admin/brands", icon: Building2 },
  { title: "Coupons", href: "/admin/coupons", icon: Ticket },
  { title: "Banners", href: "/admin/banners", icon: Megaphone },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: BarChart3, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Users", href: "/admin/users", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Orders", href: "/admin/orders", icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Products", href: "/admin/inventory", icon: Package, color: "text-pink-500", bg: "bg-pink-500/10" },
  { title: "Categories", href: "/admin/categories", icon: Layers, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Brands", href: "/admin/brands", icon: Tag, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Coupons", href: "/admin/coupons", icon: Ticket, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Banners", href: "/admin/marketing/banners", icon: Megaphone, color: "text-red-500", bg: "bg-red-500/10" },
  { title: "Contact Messages", href: "/admin/contact", icon: Inbox, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: History, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Analytics", href: "/admin/analytics", icon: PieChart, color: "text-teal-500", bg: "bg-teal-500/10" },
  { title: "Settings", href: "/admin/settings", icon: Settings, color: "text-slate-500", bg: "bg-slate-500/10" },
];
