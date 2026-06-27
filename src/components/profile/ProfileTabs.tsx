"use client";

import { User, Shield, CreditCard, Gift, History, Heart, BarChart3, Settings, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs = [
    { id: "profile", label: "Personal Info", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "security", label: "Security", icon: Shield },
    { id: "orders", label: "My Orders", icon: History },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "loyalty", label: "Loyalty & Rewards", icon: Gift },
    { id: "stats", label: "Statistics", icon: BarChart3 },
    { id: "preferences", label: "Preferences", icon: Settings },
  ];

  return (
    <div className="lg:col-span-3 space-y-2">
      <div className="bg-card rounded-[32px] border border-border/50 p-4 shadow-xl shadow-primary/5">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
