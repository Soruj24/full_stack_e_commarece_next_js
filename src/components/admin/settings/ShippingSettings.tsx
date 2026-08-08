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

export function ShippingSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Shipping"
      description="Shipping methods, rates, and fulfillment settings"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="General">
        <SettingRow label="Enable Shipping" description="Enable shipping calculations at checkout">
          <Switch
            checked={(settings.shippingEnabled as boolean) ?? true}
            onCheckedChange={(c) => onChange("shippingEnabled", c)}
          />
        </SettingRow>
        <SettingRow label="Default Shipping Fee" description="Base shipping cost per order">
          <Input
            type="number"
            min={0}
            step={0.01}
            value={(settings.shippingFee as number) || 0}
            onChange={(e) => onChange("shippingFee", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
        <SettingRow label="Free Shipping Threshold" description="Minimum order amount for free shipping (0 to disable)">
          <Input
            type="number"
            min={0}
            step={0.01}
            value={(settings.freeShippingThreshold as number) || 0}
            onChange={(e) => onChange("freeShippingThreshold", Number(e.target.value))}
            className="w-32 h-8 text-sm"
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Methods">
        <SettingRow label="Default Method" description="Default shipping method shown at checkout">
          <select
            value={(settings.defaultShippingMethod as string) || "standard"}
            onChange={(e) => onChange("defaultShippingMethod", e.target.value)}
            className="h-8 px-3 rounded-lg border border-border/60 bg-card text-sm"
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="overnight">Overnight</option>
          </select>
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Zones">
        <SettingRow label="Ship to All Countries" description="Enable worldwide shipping">
          <Switch
            checked={(settings.shipGlobal as boolean) ?? true}
            onCheckedChange={(c) => onChange("shipGlobal", c)}
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
