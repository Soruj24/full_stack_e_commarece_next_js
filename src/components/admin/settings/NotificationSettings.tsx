"use client";

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

export function NotificationSettings({ settings, onChange, saving, saved, error, hasChanges, onSave }: Props) {
  return (
    <SettingsSection
      title="Notifications"
      description="Configure which notifications to receive and how"
      saving={saving}
      saved={saved}
      error={error}
      hasChanges={hasChanges}
      onSave={onSave}
    >
      <SettingGroup title="Order Notifications">
        <SettingRow label="New Order" description="Get notified when a new order is placed">
          <Switch
            checked={(settings.notifyNewOrder as boolean) ?? true}
            onCheckedChange={(c) => onChange("notifyNewOrder", c)}
          />
        </SettingRow>
        <SettingRow label="Low Stock Alert" description="Alert when product stock is low">
          <Switch
            checked={(settings.notifyLowStock as boolean) ?? true}
            onCheckedChange={(c) => onChange("notifyLowStock", c)}
          />
        </SettingRow>
        <SettingRow label="New Review" description="Get notified when a review is submitted">
          <Switch
            checked={(settings.notifyReview as boolean) ?? true}
            onCheckedChange={(c) => onChange("notifyReview", c)}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="User Notifications">
        <SettingRow label="New User Registration" description="Get notified when a user registers">
          <Switch
            checked={(settings.notifyNewUser as boolean) ?? true}
            onCheckedChange={(c) => onChange("notifyNewUser", c)}
          />
        </SettingRow>
      </SettingGroup>

      <SettingGroup title="Reports">
        <SettingRow label="Daily Report" description="Receive daily summary email">
          <Switch
            checked={(settings.notifyDailyReport as boolean) ?? false}
            onCheckedChange={(c) => onChange("notifyDailyReport", c)}
          />
        </SettingRow>
        <SettingRow label="Weekly Report" description="Receive weekly summary email">
          <Switch
            checked={(settings.notifyWeeklyReport as boolean) ?? true}
            onCheckedChange={(c) => onChange("notifyWeeklyReport", c)}
          />
        </SettingRow>
      </SettingGroup>
    </SettingsSection>
  );
}
