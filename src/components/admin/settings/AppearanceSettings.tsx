"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsSection, SettingGroup, SettingRow } from "./SettingsSection";
import { useTheme } from "next-themes";

interface Props {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  saving: boolean;
  saved: boolean;
  error: string | null;
  hasChanges: boolean;
  onSave: () => void;
}

export function AppearanceSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection
      title="Appearance"
      description="Theme, colors, and visual customization"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Theme">
        <SettingRow label="Dark Mode" description="Toggle dark mode for admin dashboard">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(c) => {
              setTheme(c ? "dark" : "light");
              onChange("darkMode", c);
            }}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Colors">
        <SettingRow label="Primary Color" description="Main brand color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(settings.primaryColor as string) || "#3b82f6"}
              onChange={(e) => onChange("primaryColor", e.target.value)}
              className="w-8 h-8 rounded border border-border/60 cursor-pointer"
            />
            <Input
              value={(settings.primaryColor as string) || "#3b82f6"}
              onChange={(e) => onChange("primaryColor", e.target.value)}
              className="w-28 h-8 text-sm font-mono"
            />
          </div>
        </SettingRow>
        <SettingRow label="Accent Color" description="Secondary brand color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(settings.accentColor as string) || "#10b981"}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className="w-8 h-8 rounded border border-border/60 cursor-pointer"
            />
            <Input
              value={(settings.accentColor as string) || "#10b981"}
              onChange={(e) => onChange("accentColor", e.target.value)}
              className="w-28 h-8 text-sm font-mono"
            />
          </div>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Branding">
        <SettingRow label="Logo URL" description="Store logo displayed in header">
          <Input
            value={(settings.logoUrl as string) || ""}
            onChange={(e) => onChange("logoUrl", e.target.value)}
            placeholder="https://..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Favicon URL" description="Browser tab icon (.ico or .png)">
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
