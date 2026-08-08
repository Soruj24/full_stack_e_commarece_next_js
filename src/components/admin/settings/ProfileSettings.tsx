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

export function ProfileSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Profile"
      description="Your personal account settings"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Account">
        <SettingRow label="Display Name" description="How your name appears">
          <Input
            value={(settings.profileName as string) || ""}
            onChange={(e) => onChange("profileName", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Email" description="Your login email">
          <Input
            type="email"
            value={(settings.profileEmail as string) || ""}
            onChange={(e) => onChange("profileEmail", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Bio" description="Short bio for your profile">
          <Input
            value={(settings.profileBio as string) || ""}
            onChange={(e) => onChange("profileBio", e.target.value)}
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Social">
        <SettingRow label="Website">
          <Input
            value={(settings.profileWebsite as string) || ""}
            onChange={(e) => onChange("profileWebsite", e.target.value)}
            placeholder="https://..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Twitter">
          <Input
            value={(settings.twitter as string) || ""}
            onChange={(e) => onChange("twitter", e.target.value)}
            placeholder="@username"
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="LinkedIn">
          <Input
            value={(settings.linkedin as string) || ""}
            onChange={(e) => onChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
