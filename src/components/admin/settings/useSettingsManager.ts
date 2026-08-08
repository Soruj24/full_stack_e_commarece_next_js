"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export type SettingsSection =
  | "general"
  | "store"
  | "profile"
  | "security"
  | "notifications"
  | "payments"
  | "shipping"
  | "tax"
  | "email"
  | "integrations"
  | "appearance";

export interface SettingsState {
  [key: string]: unknown;
}

interface SectionStatus {
  loading: boolean;
  saving: boolean;
  error: string | null;
  saved: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  siteName: "Nexus Store",
  siteDescription: "",
  contactEmail: "",
  supportEmail: "",
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: false,
  currency: "USD",
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
  storeName: "",
  storeDescription: "",
  storeEmail: "",
  storePhone: "",
  storeAddress: "",
  storeCity: "",
  storeState: "",
  storeZip: "",
  storeCountry: "US",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#3b82f6",
  accentColor: "#10b981",
  darkMode: false,
  notifyNewOrder: true,
  notifyLowStock: true,
  notifyNewUser: true,
  notifyReview: true,
  notifyDailyReport: false,
  notifyWeeklyReport: true,
  freeShippingThreshold: 0,
  defaultShippingMethod: "standard",
  shippingRules: "",
  taxEnabled: false,
  taxName: "Sales Tax",
  taxRate: 0,
  taxShipping: false,
  resendApiKey: "",
  emailProvider: "smtp",
  slackWebhook: "",
  googleAnalyticsEnabled: false,
  facebookPixelEnabled: false,
};

export function useSettingsManager() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [initialSettings, setInitialSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [sectionStatus, setSectionStatus] = useState<Record<string, SectionStatus>>({});

  const fetchSettings = useCallback(async () => {
    setGlobalLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        const merged = { ...DEFAULT_SETTINGS, ...data.settings };
        setSettings(merged);
        setInitialSettings(merged);
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  const updateField = useCallback((key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const hasChanges = useCallback(() => {
    return JSON.stringify(settings) !== JSON.stringify(initialSettings);
  }, [settings, initialSettings]);

  const saveSection = useCallback(
    async (section: string) => {
      setSectionStatus((prev) => ({
        ...prev,
        [section]: { loading: false, saving: true, error: null, saved: false },
      }));

      try {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setInitialSettings({ ...settings });
          setSectionStatus((prev) => ({
            ...prev,
            [section]: { loading: false, saving: false, error: null, saved: true },
          }));
          toast.success("Settings saved");

          setTimeout(() => {
            setSectionStatus((prev) => ({
              ...prev,
              [section]: { loading: false, saving: false, error: null, saved: false },
            }));
          }, 2000);
        } else {
          const msg = data.error || "Failed to save";
          setSectionStatus((prev) => ({
            ...prev,
            [section]: { loading: false, saving: false, error: msg, saved: false },
          }));
          toast.error(msg);
        }
      } catch {
        setSectionStatus((prev) => ({
          ...prev,
          [section]: { loading: false, saving: false, error: "Network error", saved: false },
        }));
        toast.error("Failed to save settings");
      }
    },
    [settings]
  );

  const getStatus = useCallback(
    (section: string): SectionStatus => {
      return sectionStatus[section] || { loading: false, saving: false, error: null, saved: false };
    },
    [sectionStatus]
  );

  return {
    activeSection,
    setActiveSection,
    settings,
    globalLoading,
    fetchSettings,
    updateField,
    hasChanges,
    saveSection,
    getStatus,
  };
}
