"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DollarSign } from "lucide-react";

interface SettingsData {
  siteName: string;
  contactEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  logo: string;
  footerText: string;
  currency: string;
  googleAnalyticsId: string;
  socialLinks: { twitter: string; facebook: string; instagram: string; linkedin: string; };
}

export function SettingsGeneralTab({ settings, onChange }: { settings: SettingsData; onChange: (s: SettingsData) => void }) {
  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="py-8 px-8 border-b border-border/50">
        <CardTitle className="text-2xl font-black">General Configuration</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Site Name</Label>
            <Input value={settings.siteName} onChange={(e) => onChange({ ...settings, siteName: e.target.value })} className="h-14 rounded-2xl bg-muted/30" />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Contact Email</Label>
            <Input type="email" value={settings.contactEmail} onChange={(e) => onChange({ ...settings, contactEmail: e.target.value })} className="h-14 rounded-2xl bg-muted/30" />
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Default Currency</Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={settings.currency} onChange={(e) => onChange({ ...settings, currency: e.target.value })} className="h-14 rounded-2xl bg-muted/30 pl-12" />
            </div>
          </div>
        </div>
        <div className="space-y-6 pt-6 border-t border-border/50">
          <SwitchRow label="Registration" desc="Allow new users to create accounts" checked={settings.allowRegistration} onChange={(v) => onChange({ ...settings, allowRegistration: v })} />
          <SwitchRow label="Enable Stripe Payments" desc="Show Stripe as a payment option" checked={(settings as any).stripeEnabled ?? true} onChange={(v) => onChange({ ...settings, stripeEnabled: v } as any)} />
          <SwitchRow label="Enable PayPal" desc="Show PayPal as a payment option" checked={(settings as any).paypalEnabled ?? true} onChange={(v) => onChange({ ...settings, paypalEnabled: v } as any)} />
        </div>
      </CardContent>
    </Card>
  );
}

function SwitchRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-6 bg-muted/20 rounded-3xl border border-border/50">
      <div className="space-y-1">
        <p className="font-bold">{label}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
