import {
  LayoutDashboard, Users, Package, ShoppingCart, FolderTree, Building2,
  Ticket, BarChart3, MessageSquare, Settings,
  ShoppingBag, Layers, Tag, Inbox, PieChart,
  DollarSign, TrendingUp, FileText, Bell, Key, Lock, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarLinks: SidebarLink[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Sales", href: "/admin/sales", icon: TrendingUp },
  { title: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Brands", href: "/admin/brands", icon: Building2 },
  { title: "Customers", href: "/admin/users", icon: Users },
  { title: "Inventory", href: "/admin/inventory", icon: Package },
  { title: "Coupons", href: "/admin/coupons", icon: Ticket },
  { title: "Reports", href: "/admin/reports", icon: FileText },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Activity Logs", href: "/admin/audit-logs", icon: Activity },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Roles", href: "/admin/roles", icon: Key },
  { title: "Permissions", href: "/admin/permissions", icon: Lock },
  { title: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
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
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Sales", href: "/admin/sales", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Revenue", href: "/admin/revenue", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Orders", href: "/admin/orders", icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { title: "Products", href: "/admin/products", icon: Package, color: "text-pink-500", bg: "bg-pink-500/10" },
  { title: "Categories", href: "/admin/categories", icon: Layers, color: "text-amber-500", bg: "bg-amber-500/10" },
  { title: "Brands", href: "/admin/brands", icon: Tag, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Customers", href: "/admin/users", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Inventory", href: "/admin/inventory", icon: Package, color: "text-rose-500", bg: "bg-rose-500/10" },
  { title: "Coupons", href: "/admin/coupons", icon: Ticket, color: "text-green-600", bg: "bg-green-600/10" },
  { title: "Reports", href: "/admin/reports", icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
  { title: "Analytics", href: "/admin/analytics", icon: PieChart, color: "text-teal-500", bg: "bg-teal-500/10" },
  { title: "Activity Logs", href: "/admin/audit-logs", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Notifications", href: "/admin/notifications", icon: Bell, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { title: "Roles", href: "/admin/roles", icon: Key, color: "text-violet-500", bg: "bg-violet-500/10" },
  { title: "Permissions", href: "/admin/permissions", icon: Lock, color: "text-red-500", bg: "bg-red-500/10" },
  { title: "Contact Messages", href: "/admin/contact", icon: Inbox, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { title: "Settings", href: "/admin/settings", icon: Settings, color: "text-slate-500", bg: "bg-slate-500/10" },
];
