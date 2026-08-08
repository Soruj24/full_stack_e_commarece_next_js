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

export function TaxSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Tax"
      description="Tax calculation and compliance settings"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Tax Configuration">
        <SettingRow label="Enable Tax" description="Calculate tax at checkout">
          <Switch
            checked={(settings.taxEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("taxEnabled", c)}
          />
        </SettingRow>
        <SettingRow label="Tax Name" description="Label shown on receipts">
          <Input
            value={(settings.taxName as string) || "Sales Tax"}
            onChange={(e) => onChange("taxName", e.target.value)}
            className="w-48 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Tax Rate (%)" description="Default tax percentage">
          <Input
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={(settings.taxRate as number) || 0}
            onChange={(e) => onChange("taxRate", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Tax Shipping" description="Apply tax to shipping costs">
          <Switch
            checked={(settings.taxShipping as boolean) ?? false}
            onCheckedChange={(c) => onChange("taxShipping", c)}
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
