"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface PaymentSettingsProps {
  settings: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function PaymentSettings({ settings, onChange }: PaymentSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Stripe</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Stripe</Label>
              <p className="text-sm text-muted-foreground">Accept credit card payments via Stripe</p>
            </div>
            <Switch
              checked={(settings.stripeEnabled as boolean) ?? false}
              onCheckedChange={(checked) => onChange("stripeEnabled", checked)}
            />
          </div>
          {(settings.stripeEnabled as boolean) && (
            <div className="grid gap-4 pl-6">
              <div className="grid gap-2">
                <Label htmlFor="stripePublicKey">Public Key</Label>
                <Input
                  id="stripePublicKey"
                  value={(settings.stripePublicKey as string) || ""}
                  onChange={(e) => onChange("stripePublicKey", e.target.value)}
                  placeholder="pk_live_..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripeSecretKey">Secret Key</Label>
                <Input
                  id="stripeSecretKey"
                  type="password"
                  value={(settings.stripeSecretKey as string) || ""}
                  onChange={(e) => onChange("stripeSecretKey", e.target.value)}
                  placeholder="sk_live_..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">PayPal</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable PayPal</Label>
              <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
            </div>
            <Switch
              checked={(settings.paypalEnabled as boolean) ?? false}
              onCheckedChange={(checked) => onChange("paypalEnabled", checked)}
            />
          </div>
          {(settings.paypalEnabled as boolean) && (
            <div className="grid gap-4 pl-6">
              <div className="grid gap-2">
                <Label htmlFor="paypalClientId">Client ID</Label>
                <Input
                  id="paypalClientId"
                  value={(settings.paypalClientId as string) || ""}
                  onChange={(e) => onChange("paypalClientId", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paypalSecret">Secret</Label>
                <Input
                  id="paypalSecret"
                  type="password"
                  value={(settings.paypalSecret as string) || ""}
                  onChange={(e) => onChange("paypalSecret", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Mobile Payment (Bangladesh)</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>bKash</Label>
              <p className="text-sm text-muted-foreground">Enable bKash payments</p>
            </div>
            <Switch
              checked={(settings.bKashEnabled as boolean) ?? false}
              onCheckedChange={(checked) => onChange("bKashEnabled", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Nagad</Label>
              <p className="text-sm text-muted-foreground">Enable Nagad payments</p>
            </div>
            <Switch
              checked={(settings.nagadEnabled as boolean) ?? false}
              onCheckedChange={(checked) => onChange("nagadEnabled", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Rocket</Label>
              <p className="text-sm text-muted-foreground">Enable Rocket payments</p>
            </div>
            <Switch
              checked={(settings.rocketEnabled as boolean) ?? false}
              onCheckedChange={(checked) => onChange("rocketEnabled", checked)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Cash on Delivery</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable COD</Label>
            <p className="text-sm text-muted-foreground">Allow cash on delivery payments</p>
          </div>
          <Switch
            checked={(settings.codEnabled as boolean) ?? true}
            onCheckedChange={(checked) => onChange("codEnabled", checked)}
          />
        </div>
      </div>
    </div>
  );
}
