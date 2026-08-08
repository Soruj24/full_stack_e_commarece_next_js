"use client";

import {
  Settings,
  Store,
  User,
  Shield,
  Bell,
  CreditCard,
  Truck,
  Receipt,
  Mail,
  Plug,
  Palette,
} from "lucide-react";
import type { SettingsSection } from "./useSettingsManager";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { key: SettingsSection; label: string; icon: React.ElementType }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "store", label: "Store", icon: Store },
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "tax", label: "Tax", icon: Receipt },
  { key: "email", label: "Email", icon: Mail },
  { key: "integrations", label: "Integrations", icon: Plug },
  { key: "appearance", label: "Appearance", icon: Palette },
];

export function SettingsLayout({
  activeSection,
  onSectionChange,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      <nav className="w-full lg:w-56 shrink-0">
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 sticky top-0 lg:top-6 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left whitespace-nowrap shrink-0",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="flex-1 min-w-0">
        <div className="max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
