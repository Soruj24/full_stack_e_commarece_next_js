import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  ShoppingCart,
  Megaphone,
  Settings,
} from "lucide-react";

interface AdminTabsListProps {
  activeTab: string;
}

const tabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "users", label: "Users", icon: Users },
  { value: "inquiries", label: "Inquiries", icon: MessageSquare },
  { value: "audit", label: "Audit", icon: ShieldAlert },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
  { value: "orders", label: "Orders", icon: ShoppingCart },
  { value: "marketing", label: "Marketing", icon: Megaphone },
  { value: "settings", label: "Settings", icon: Settings },
];

export function AdminTabsList({ activeTab }: AdminTabsListProps) {
  return (
    <TabsList className="w-full h-auto p-1 bg-muted/30 border border-border/60 rounded-lg grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-0.5">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium text-xs h-9 gap-1.5"
        >
          <tab.icon className="w-3.5 h-3.5" />
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
