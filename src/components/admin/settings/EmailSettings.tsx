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

export function EmailSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Email"
      description="SMTP and transactional email configuration"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="SMTP">
        <SettingRow label="Host" description="SMTP server hostname">
          <Input
            value={(settings.smtpHost as string) || ""}
            onChange={(e) => onChange("smtpHost", e.target.value)}
            placeholder="smtp.gmail.com"
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Port" description="SMTP server port">
          <Input
            type="number"
            value={(settings.smtpPort as number) || 587}
            onChange={(e) => onChange("smtpPort", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Username">
          <Input
            value={(settings.smtpUser as string) || ""}
            onChange={(e) => onChange("smtpUser", e.target.value)}
            placeholder="your-email@gmail.com"
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Password">
          <Input
            type="password"
            value={(settings.smtpPass as string) || ""}
            onChange={(e) => onChange("smtpPass", e.target.value)}
            placeholder="App password"
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="From Address" description="Sender email address">
          <Input
            type="email"
            value={(settings.smtpFrom as string) || ""}
            onChange={(e) => onChange("smtpFrom", e.target.value)}
            placeholder="noreply@example.com"
            className="w-64 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Provider">
        <SettingRow label="Email Provider" description="Select your email service">
          <select
            value={(settings.emailProvider as string) || "smtp"}
            onChange={(e) => onChange("emailProvider", e.target.value)}
            className="h-8 px-3 rounded-lg border border-border/60 bg-card text-sm"
          >
            <option value="smtp">Custom SMTP</option>
            <option value="resend">Resend</option>
            <option value="sendgrid">SendGrid</option>
            <option value="ses">Amazon SES</option>
          </select>
        </SettingRow>
        {(settings.emailProvider as string) === "resend" && (
          <SettingRow label="Resend API Key">
            <Input
              type="password"
              value={(settings.resendApiKey as string) || ""}
              onChange={(e) => onChange("resendApiKey", e.target.value)}
              placeholder="re_..."
              className="w-64 h-8 text-sm font-mono"
            />
          </SettingRow>
        )}
      </SettingGroup>
    </SettingsSection>
  );
}
