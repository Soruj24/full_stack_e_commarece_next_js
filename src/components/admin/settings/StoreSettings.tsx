"use client";

import { Input } from "@/components/ui/input";
import { SettingsSection, SettingGroup, SettingRow } from "./SettingsSection";

interface Props {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  saving: boolean;
  saved: boolean;
  error: string | null;
  hasChanges: boolean;
  onSave: () => void;
}

export function StoreSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Store"
      description="Store details, branding, and business information"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Business">
        <SettingRow label="Store Name" description="Display name for your store">
          <Input
            value={(settings.storeName as string) || (settings.siteName as string) || ""}
            onChange={(e) => onChange("storeName", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Store Description" description="About your store">
          <Input
            value={(settings.storeDescription as string) || ""}
            onChange={(e) => onChange("storeDescription", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Store Email" description="Business email address">
          <Input
            type="email"
            value={(settings.storeEmail as string) || ""}
            onChange={(e) => onChange("storeEmail", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Phone Number" description="Business phone">
          <Input
            type="tel"
            value={(settings.storePhone as string) || ""}
            onChange={(e) => onChange("storePhone", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Address">
        <SettingRow label="Street Address" description="Street address">
          <Input
            value={(settings.storeAddress as string) || ""}
            onChange={(e) => onChange("storeAddress", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="City">
          <Input
            value={(settings.storeCity as string) || ""}
            onChange={(e) => onChange("storeCity", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="State / Province">
          <Input
            value={(settings.storeState as string) || ""}
            onChange={(e) => onChange("storeState", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="ZIP / Postal Code">
          <Input
            value={(settings.storeZip as string) || ""}
            onChange={(e) => onChange("storeZip", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Country" description="Two-letter country code">
          <Input
            value={(settings.storeCountry as string) || "US"}
            onChange={(e) => onChange("storeCountry", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Branding">
        <SettingRow label="Logo URL" description="URL to your store logo">
          <Input
            value={(settings.logoUrl as string) || ""}
            onChange={(e) => onChange("logoUrl", e.target.value)}
            placeholder="https://..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Favicon URL" description="URL to favicon (.ico or .png)">
          <Input
            value={(settings.faviconUrl as string) || ""}
            onChange={(e) => onChange("faviconUrl", e.target.value)}
            placeholder="https://..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
