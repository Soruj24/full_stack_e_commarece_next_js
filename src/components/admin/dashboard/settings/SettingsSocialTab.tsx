"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

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

export function SettingsSocialTab({ settings, onChange }: { settings: SettingsData; onChange: (s: SettingsData) => void }) {
  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
      <CardHeader className="py-8 px-8 border-b border-border/50">
        <CardTitle className="text-2xl font-black">Social Connections</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SocialInput label="Twitter" icon={<Twitter className="w-4 h-4" />} value={settings.socialLinks?.twitter} onChange={(v) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, twitter: v } })} />
          <SocialInput label="Facebook" icon={<Facebook className="w-4 h-4" />} value={settings.socialLinks?.facebook} onChange={(v) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, facebook: v } })} />
          <SocialInput label="Instagram" icon={<Instagram className="w-4 h-4" />} value={settings.socialLinks?.instagram} onChange={(v) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, instagram: v } })} />
          <SocialInput label="LinkedIn" icon={<Linkedin className="w-4 h-4" />} value={settings.socialLinks?.linkedin} onChange={(v) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: v } })} />
        </div>
      </CardContent>
    </Card>
  );
}

function SocialInput({ label, icon, value, onChange }: { label: string; icon: React.ReactNode; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">{icon} {label}</Label>
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-14 rounded-2xl bg-muted/30" />
    </div>
  );
}
