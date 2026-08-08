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

export function IntegrationSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Integrations"
      description="Third-party services and analytics connections"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Analytics">
        <SettingRow label="Google Analytics" description="Enable Google Analytics tracking">
          <Switch
            checked={(settings.googleAnalyticsEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("googleAnalyticsEnabled", c)}
          />
        </SettingRow>
        {(settings.googleAnalyticsEnabled as boolean) && (
          <SettingRow label="GA Measurement ID" description="G-XXXXXXXXXX">
            <Input
              value={(settings.googleAnalyticsId as string) || ""}
              onChange={(e) => onChange("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-64 h-8 text-sm font-mono"
            />
          </SettingRow>
        )}
        <SettingRow label="Facebook Pixel" description="Enable Facebook Pixel tracking">
          <Switch
            checked={(settings.facebookPixelEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("facebookPixelEnabled", c)}
          />
        </SettingRow>
        {(settings.facebookPixelEnabled as boolean) && (
          <SettingRow label="Pixel ID">
            <Input
              value={(settings.facebookPixelId as string) || ""}
              onChange={(e) => onChange("facebookPixelId", e.target.value)}
              placeholder="XXXXXXXXXX"
              className="w-64 h-8 text-sm font-mono"
            />
          </SettingRow>
        )}
      </SettingGroup>

      <SettingGroup title="Notifications">
        <SettingRow label="Slack Webhook" description="Post order notifications to Slack">
          <Input
            value={(settings.slackWebhook as string) || ""}
            onChange={(e) => onChange("slackWebhook", e.target.value)}
            placeholder="https://hooks.slack.com/..."
            className="w-64 h-8 text-sm font-mono"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Social">
        <SettingRow label="Facebook">
          <Input
            value={(settings.facebook as string) || ""}
            onChange={(e) => onChange("facebook", e.target.value)}
            placeholder="https://facebook.com/..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Instagram">
          <Input
            value={(settings.instagram as string) || ""}
            onChange={(e) => onChange("instagram", e.target.value)}
            placeholder="@username"
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
            placeholder="https://linkedin.com/company/..."
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
