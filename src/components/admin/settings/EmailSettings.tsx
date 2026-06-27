"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface EmailSettingsProps {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function EmailSettings({ settings, onChange }: EmailSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">SMTP Configuration</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              value={(settings.smtpHost as string) || ""}
              onChange={(e) => onChange("smtpHost", e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              type="number"
              value={(settings.smtpPort as number) || 587}
              onChange={(e) => onChange("smtpPort", Number(e.target.value))}
              placeholder="587"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpUser">SMTP Username</Label>
            <Input
              id="smtpUser"
              value={(settings.smtpUser as string) || ""}
              onChange={(e) => onChange("smtpUser", e.target.value)}
              placeholder="your-email@gmail.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpPass">SMTP Password</Label>
            <Input
              id="smtpPass"
              type="password"
              value={(settings.smtpPass as string) || ""}
              onChange={(e) => onChange("smtpPass", e.target.value)}
              placeholder="App password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="smtpFrom">From Email Address</Label>
            <Input
              id="smtpFrom"
              type="email"
              value={(settings.smtpFrom as string) || ""}
              onChange={(e) => onChange("smtpFrom", e.target.value)}
              placeholder="noreply@example.com"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Email Notifications</h4>
        <p className="text-sm text-muted-foreground">
          The following emails are sent automatically:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 mt-2">
          <li>• Welcome email on registration</li>
          <li>• Order confirmation</li>
          <li>• Shipping notification</li>
          <li>• Password reset</li>
          <li>• Email verification</li>
        </ul>
      </div>
    </div>
  );
}
