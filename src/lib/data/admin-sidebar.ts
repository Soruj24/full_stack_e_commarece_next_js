import {
  LayoutDashboard, Package, Layers, ShoppingBag, Users, Star,
  Ticket, CreditCard, PieChart, FileText, Settings,
  TrendingUp, DollarSign, Bell, Key, Lock, Activity, Gift,
  MessageCircle, AlertTriangle, ShoppingCart, Store, Inbox,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "default" | "success" | "warning" | "danger";
}

export interface SidebarGroup {
  label: string;
  icon: LucideIcon;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

export const sidebarGroups: SidebarGroup[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    defaultOpen: true,
    items: [
      { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Commerce",
    icon: ShoppingBag,
    defaultOpen: true,
    items: [
      { title: "Orders", href: "/admin/orders", icon: ShoppingBag, badge: "12", badgeVariant: "warning" },
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Categories", href: "/admin/categories", icon: Layers },
      { title: "Customers", href: "/admin/users", icon: Users },
      { title: "Reviews", href: "/admin/reviews", icon: Star },
      { title: "Inventory", href: "/admin/inventory", icon: Package, badge: "3", badgeVariant: "danger" },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    items: [
      { title: "Payments", href: "/admin/revenue", icon: CreditCard },
      { title: "Coupons", href: "/admin/coupons", icon: Ticket },
      { title: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
    ],
  },
  {
    label: "Insights",
    icon: PieChart,
    items: [
      { title: "Analytics", href: "/admin/analytics", icon: PieChart },
      { title: "Reports", href: "/admin/reports", icon: FileText },
      { title: "Sales", href: "/admin/sales", icon: TrendingUp },
    ],
  },
  {
    label: "Operations",
    icon: Activity,
    items: [
      { title: "Contact", href: "/admin/contact", icon: Inbox },
      { title: "Returns", href: "/admin/returns", icon: Package },
      { title: "FAQs", href: "/admin/faqs", icon: MessageCircle },
      { title: "Low Stock", href: "/admin/low-stock", icon: AlertTriangle, badge: "!", badgeVariant: "danger" },
      { title: "Abandoned Carts", href: "/admin/abandoned-carts", icon: ShoppingCart },
      { title: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    icon: Settings,
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
