"use client";

import { useEffect } from "react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import {
  useSettingsManager,
  SettingsLayout,
  GeneralSettings,
  StoreSettings,
  ProfileSettings,
  SecuritySettings,
  NotificationSettings,
  PaymentSettings,
  ShippingSettings,
  TaxSettings,
  EmailSettings,
  IntegrationSettings,
  AppearanceSettings,
} from "@/components/admin/settings";

export default function SettingsPage() {
  const {
    activeSection,
    setActiveSection,
    settings,
    globalLoading,
    fetchSettings,
    updateField,
    hasChanges,
    saveSection,
    getStatus,
  } = useSettingsManager();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (globalLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted/30 rounded-lg animate-pulse" />
        <div className="flex gap-6">
          <div className="w-56 space-y-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <div key={i} className="h-9 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-32 bg-muted/30 rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted/20 rounded animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sectionProps = {
    settings,
    onChange: updateField,
    saving: getStatus(activeSection).saving,
    saved: getStatus(activeSection).saved,
    error: getStatus(activeSection).error,
    hasChanges: hasChanges(),
    onSave: () => saveSection(activeSection),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your store, payments, shipping, and integrations"
      />

      <SettingsLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {activeSection === "general" && <GeneralSettings {...sectionProps} />}
        {activeSection === "store" && <StoreSettings {...sectionProps} />}
        {activeSection === "profile" && <ProfileSettings {...sectionProps} />}
        {activeSection === "security" && <SecuritySettings {...sectionProps} />}
        {activeSection === "notifications" && <NotificationSettings {...sectionProps} />}
        {activeSection === "payments" && <PaymentSettings {...sectionProps} />}
        {activeSection === "shipping" && <ShippingSettings {...sectionProps} />}
        {activeSection === "tax" && <TaxSettings {...sectionProps} />}
        {activeSection === "email" && <EmailSettings {...sectionProps} />}
        {activeSection === "integrations" && <IntegrationSettings {...sectionProps} />}
        {activeSection === "appearance" && <AppearanceSettings {...sectionProps} />}
      </SettingsLayout>
    </div>
  );
}
