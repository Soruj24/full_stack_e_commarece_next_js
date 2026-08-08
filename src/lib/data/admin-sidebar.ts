import {
  LayoutDashboard, Users, Package, ShoppingCart, FolderTree, Building2,
  Ticket, BarChart3, MessageSquare, Settings,
  ShoppingBag, Layers, Tag, Inbox, PieChart,
  DollarSign, TrendingUp, FileText, Bell, Key, Lock, Activity,
  Gift, MessageCircle, AlertTriangle, Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface SidebarGroup {
  label: string;
  items: SidebarItem[];
}

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Commerce",
    items: [
      { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Categories", href: "/admin/categories", icon: Layers },
      { title: "Brands", href: "/admin/brands", icon: Tag },
      { title: "Inventory", href: "/admin/inventory", icon: Package },
      { title: "Customers", href: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Growth",
    items: [
      { title: "Sales", href: "/admin/sales", icon: TrendingUp },
      { title: "Revenue", href: "/admin/revenue", icon: DollarSign },
      { title: "Analytics", href: "/admin/analytics", icon: PieChart },
      { title: "Coupons", href: "/admin/coupons", icon: Ticket },
      { title: "Reports", href: "/admin/reports", icon: FileText },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Contact", href: "/admin/contact", icon: Inbox },
      { title: "Returns", href: "/admin/returns", icon: Package },
      { title: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
      { title: "FAQs", href: "/admin/faqs", icon: MessageCircle },
      { title: "Low Stock", href: "/admin/low-stock", icon: AlertTriangle },
      { title: "Abandoned Carts", href: "/admin/abandoned-carts", icon: ShoppingCart },
      { title: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Vendors", href: "/admin/vendors", icon: Store },
      { title: "Roles", href: "/admin/roles", icon: Key },
      { title: "Permissions", href: "/admin/permissions", icon: Lock },
      { title: "Activity Logs", href: "/admin/audit-logs", icon: Activity },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// Flat list for command palette and legacy use
export const sidebarItems: { title: string; href: string; icon: LucideIcon }[] =
  sidebarGroups.flatMap((g) => g.items);
