"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function SettingsBrandingTab({ settings, onChange }: { settings: SettingsData; onChange: (s: SettingsData) => void }) {
  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="py-8 px-8 border-b border-border/50">
        <CardTitle className="text-2xl font-black">Branding & UI</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-3">
          <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Logo URL</Label>
          <Input value={settings.logo} onChange={(e) => onChange({ ...settings, logo: e.target.value })} className="h-14 rounded-2xl bg-muted/30" placeholder="https://example.com/logo.png" />
        </div>
        <div className="space-y-3">
          <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Footer Copyright Text</Label>
          <Input value={settings.footerText} onChange={(e) => onChange({ ...settings, footerText: e.target.value })} className="h-14 rounded-2xl bg-muted/30" />
        </div>
      </CardContent>
    </Card>
  );
}
