"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { SettingsTabs } from "@/components/admin/settings/SettingsTabs";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { PaymentSettings } from "@/components/admin/settings/PaymentSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { EmailSettings } from "@/components/admin/settings/EmailSettings";

const defaultSettings: Record<string, unknown> = {
  siteName: "E-Commerce Store",
  siteDescription: "",
  contactEmail: "",
  supportEmail: "",
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  currency: "USD",
  taxRate: 0,
  shippingFee: 0,
  stripeEnabled: false,
  stripePublicKey: "",
  stripeSecretKey: "",
  paypalEnabled: false,
  paypalClientId: "",
  paypalSecret: "",
  bKashEnabled: false,
  nagadEnabled: false,
  rocketEnabled: false,
  codEnabled: true,
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  smtpFrom: "",
  googleAnalyticsId: "",
  facebookPixelId: "",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<Record<string, unknown>>(defaultSettings);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      redirect("/login");
    }
    fetchSettings();
  }, [session, status]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <SettingsHeader saving={saving} onSave={handleSave} />

        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="bg-card border border-border/50 rounded-[48px] shadow-2xl shadow-primary/5 overflow-hidden p-8">
          {activeTab === "general" && (
            <GeneralSettings settings={settings} onChange={handleChange} />
          )}
          {activeTab === "payment" && (
            <PaymentSettings settings={settings} onChange={handleChange} />
          )}
          {activeTab === "security" && (
            <SecuritySettings settings={settings} onChange={handleChange} />
          )}
          {activeTab === "email" && (
            <EmailSettings settings={settings} onChange={handleChange} />
          )}
        </div>
      </div>
    </div>
  );
}
