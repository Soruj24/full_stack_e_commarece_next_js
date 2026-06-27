"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SecuritySettingsProps {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function SecuritySettings({ settings, onChange }: SecuritySettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">
                Users must verify their email before logging in
              </p>
            </div>
            <Switch
              checked={(settings.requireEmailVerification as boolean) ?? false}
              onCheckedChange={(checked) => onChange("requireEmailVerification", checked)}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Two-factor authentication is configured per-user. Admin users can enable 2FA from their profile settings.
        </p>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Password Requirements</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Minimum 8 characters</li>
          <li>• At least one uppercase letter</li>
          <li>• At least one lowercase letter</li>
          <li>• At least one number</li>
        </ul>
      </div>
    </div>
  );
}
