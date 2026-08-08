"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

export function GeneralSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="General"
      description="Basic site configuration and global settings"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Site">
        <SettingRow label="Site Name" description="The name of your store">
          <Input
            value={(settings.siteName as string) || ""}
            onChange={(e) => onChange("siteName", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Site Description" description="Brief description for SEO">
          <Input
            value={(settings.siteDescription as string) || ""}
            onChange={(e) => onChange("siteDescription", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Contact Email" description="Primary contact email">
          <Input
            type="email"
            value={(settings.contactEmail as string) || ""}
            onChange={(e) => onChange("contactEmail", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Support Email" description="Customer support email">
          <Input
            type="email"
            value={(settings.supportEmail as string) || ""}
            onChange={(e) => onChange("supportEmail", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Registration">
        <SettingRow label="Allow Registration" description="Allow new users to create accounts">
          <Switch
            checked={(settings.allowRegistration as boolean) ?? true}
            onCheckedChange={(c) => onChange("allowRegistration", c)}
          />
        </SettingRow>
        <SettingRow label="Require Email Verification" description="Users must verify email before login">
          <Switch
            checked={(settings.requireEmailVerification as boolean) ?? false}
            onCheckedChange={(c) => onChange("requireEmailVerification", c)}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="System">
        <SettingRow label="Maintenance Mode" description="Show maintenance page to all users">
          <Switch
            checked={(settings.maintenanceMode as boolean) ?? false}
            onCheckedChange={(c) => onChange("maintenanceMode", c)}
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
