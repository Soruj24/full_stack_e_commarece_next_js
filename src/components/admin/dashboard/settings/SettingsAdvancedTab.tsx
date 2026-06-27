"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BarChart, Lock } from "lucide-react";

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

export function SettingsAdvancedTab({ settings, onChange }: { settings: SettingsData; onChange: (s: SettingsData) => void }) {
  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="py-8 px-8 border-b border-border/50">
        <CardTitle className="text-2xl font-black">Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
            <BarChart className="w-4 h-4" /> Google Analytics ID
          </Label>
          <Input value={settings.googleAnalyticsId} onChange={(e) => onChange({ ...settings, googleAnalyticsId: e.target.value })} className="h-14 rounded-2xl bg-muted/30" placeholder="G-XXXXXXXXXX" />
        </div>
        <div className="flex items-center justify-between p-6 bg-destructive/5 rounded-3xl border border-destructive/10">
          <div className="space-y-1">
            <p className="font-bold text-destructive flex items-center gap-2"><Lock className="w-4 h-4" /> Maintenance Mode</p>
            <p className="text-sm text-muted-foreground">Put the entire site into maintenance mode</p>
          </div>
          <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => onChange({ ...settings, maintenanceMode: v })} />
        </div>
      </CardContent>
    </Card>
  );
}
