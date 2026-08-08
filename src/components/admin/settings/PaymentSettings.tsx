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

export function PaymentSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Payments"
      description="Payment gateways and transaction settings"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Stripe">
        <SettingRow label="Enable Stripe" description="Accept credit/debit cards via Stripe">
          <Switch
            checked={(settings.stripeEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("stripeEnabled", c)}
          />
        </SettingRow>
        {(settings.stripeEnabled as boolean) && (
          <>
            <SettingRow label="Publishable Key">
              <Input
                value={(settings.stripePublicKey as string) || ""}
                onChange={(e) => onChange("stripePublicKey", e.target.value)}
                placeholder="pk_live_..."
                className="w-64 h-8 text-sm font-mono"
              />
            </SettingRow>
            <SettingRow label="Secret Key">
              <Input
                type="password"
                value={(settings.stripeSecretKey as string) || ""}
                onChange={(e) => onChange("stripeSecretKey", e.target.value)}
                placeholder="sk_live_..."
                className="w-64 h-8 text-sm font-mono"
              />
            </SettingRow>
          </>
        )}
      </SettingGroup>

      <SettingGroup title="PayPal">
        <SettingRow label="Enable PayPal" description="Accept PayPal payments">
          <Switch
            checked={(settings.paypalEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("paypalEnabled", c)}
          />
        </SettingRow>
        {(settings.paypalEnabled as boolean) && (
          <>
            <SettingRow label="Client ID">
              <Input
                value={(settings.paypalClientId as string) || ""}
                onChange={(e) => onChange("paypalClientId", e.target.value)}
                className="w-64 h-8 text-sm font-mono"
              />
            </SettingRow>
            <SettingRow label="Secret">
              <Input
                type="password"
                value={(settings.paypalSecret as string) || ""}
                onChange={(e) => onChange("paypalSecret", e.target.value)}
                className="w-64 h-8 text-sm font-mono"
              />
            </SettingRow>
          </>
        )}
      </SettingGroup>

      <SettingGroup title="Mobile Payment">
        <SettingRow label="bKash" description="Enable bKash payments">
          <Switch
            checked={(settings.bKashEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("bKashEnabled", c)}
          />
        </SettingRow>
        <SettingRow label="Nagad" description="Enable Nagad payments">
          <Switch
            checked={(settings.nagadEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("nagadEnabled", c)}
          />
        </SettingRow>
        <SettingRow label="Rocket" description="Enable Rocket payments">
          <Switch
            checked={(settings.rocketEnabled as boolean) ?? false}
            onCheckedChange={(c) => onChange("rocketEnabled", c)}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Other">
        <SettingRow label="Cash on Delivery" description="Allow COD payments">
          <Switch
            checked={(settings.codEnabled as boolean) ?? true}
            onCheckedChange={(c) => onChange("codEnabled", c)}
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
