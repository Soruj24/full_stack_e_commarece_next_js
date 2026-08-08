"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
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
