
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

export function AdminTabsList({ activeTab }: AdminTabsListProps) {
  return (
    <TabsList className="w-full h-auto p-2 bg-card border border-border/50 rounded-[24px] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
      <TabsTrigger
        value="overview"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Overview
      </TabsTrigger>
      <TabsTrigger
        value="users"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <Users className="w-4 h-4 mr-2" />
        Users
      </TabsTrigger>
      <TabsTrigger
        value="inquiries"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Inquiries
      </TabsTrigger>
      <TabsTrigger
        value="audit"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <ShieldAlert className="w-4 h-4 mr-2" />
        Audit
      </TabsTrigger>
      <TabsTrigger
        value="analytics"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Analytics
      </TabsTrigger>
      <TabsTrigger
        value="orders"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        Orders
      </TabsTrigger>
      <TabsTrigger
        value="marketing"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <Megaphone className="w-4 h-4 mr-2" />
        Marketing
      </TabsTrigger>
      <TabsTrigger
        value="settings"
        className="rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold h-10"
      >
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </TabsTrigger>
    </TabsList>
  );
}
