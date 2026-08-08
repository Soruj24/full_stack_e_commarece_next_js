"use client";

import { Switch } from "@/components/ui/switch";
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

export function SecuritySettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Security"
      description="Authentication, sessions, and access control"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Authentication">
        <SettingRow label="Require Email Verification" description="Users must verify email before login">
          <Switch
            checked={(settings.requireEmailVerification as boolean) ?? false}
            onCheckedChange={(c) => onChange("requireEmailVerification", c)}
          />
        </SettingRow>
        <SettingRow label="Two-Factor Authentication" description="Enforce 2FA for all admin users">
          <Switch
            checked={(settings.enforce2FA as boolean) ?? false}
            onCheckedChange={(c) => onChange("enforce2FA", c)}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Sessions">
        <SettingRow label="Session Timeout" description="Auto-logout after inactivity (minutes)">
          <Input
            type="number"
            value={(settings.sessionTimeout as number) || 60}
            onChange={(e) => onChange("sessionTimeout", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Max Login Attempts" description="Lock account after failed attempts">
          <Input
            type="number"
            value={(settings.maxLoginAttempts as number) || 5}
            onChange={(e) => onChange("maxLoginAttempts", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Password Policy">
        <SettingRow label="Minimum Length" description="Minimum password length">
          <Input
            type="number"
            value={(settings.minPasswordLength as number) || 8}
            onChange={(e) => onChange("minPasswordLength", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Require Uppercase">
          <Switch
            checked={(settings.requireUppercase as boolean) ?? true}
            onCheckedChange={(c) => onChange("requireUppercase", c)}
          />
        </SettingRow>
        <SettingRow label="Require Number">
          <Switch
            checked={(settings.requireNumber as boolean) ?? true}
            onCheckedChange={(c) => onChange("requireNumber", c)}
          />
        </SettingRow>
        <SettingRow label="Require Special Character">
          <Switch
            checked={(settings.requireSpecial as boolean) ?? false}
            onCheckedChange={(c) => onChange("requireSpecial", c)}
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
