"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface GeneralSettingsProps {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={(settings.siteName as string) || ""}
              onChange={(e) => onChange("siteName", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input
              id="siteDescription"
              value={(settings.siteDescription as string) || ""}
              onChange={(e) => onChange("siteDescription", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={(settings.contactEmail as string) || ""}
                onChange={(e) => onChange("contactEmail", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={(settings.supportEmail as string) || ""}
                onChange={(e) => onChange("supportEmail", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={(settings.currency as string) || "USD"}
                onChange={(e) => onChange("currency", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={(settings.taxRate as number) || 0}
                onChange={(e) => onChange("taxRate", Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shippingFee">Default Shipping Fee</Label>
              <Input
                id="shippingFee"
                type="number"
                value={(settings.shippingFee as number) || 0}
                onChange={(e) => onChange("shippingFee", Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Registration Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Registration</Label>
              <p className="text-sm text-muted-foreground">Allow new users to register</p>
            </div>
            <Switch
              checked={(settings.allowRegistration as boolean) ?? true}
              onCheckedChange={(checked) => onChange("allowRegistration", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Email Verification</Label>
              <p className="text-sm text-muted-foreground">Users must verify email before login</p>
            </div>
            <Switch
              checked={(settings.requireEmailVerification as boolean) ?? false}
              onCheckedChange={(checked) => onChange("requireEmailVerification", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Show maintenance page to all users</p>
            </div>
            <Switch
              checked={(settings.maintenanceMode as boolean) ?? false}
              onCheckedChange={(checked) => onChange("maintenanceMode", checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Analytics & Tracking</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
            <Input
              id="googleAnalyticsId"
              value={(settings.googleAnalyticsId as string) || ""}
              onChange={(e) => onChange("googleAnalyticsId", e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
            <Input
              id="facebookPixelId"
              value={(settings.facebookPixelId as string) || ""}
              onChange={(e) => onChange("facebookPixelId", e.target.value)}
              placeholder="XXXXXXXXXX"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={(settings.facebook as string) || ""}
              onChange={(e) => onChange("facebook", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={(settings.twitter as string) || ""}
              onChange={(e) => onChange("twitter", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={(settings.instagram as string) || ""}
              onChange={(e) => onChange("instagram", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={(settings.linkedin as string) || ""}
              onChange={(e) => onChange("linkedin", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
