"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, Shield, Lock, RefreshCcw, ShieldCheck, Twitter, Facebook, Instagram, Linkedin, Palette, BarChart, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminSettingsProps {
  settings: {
    siteName: string;
    contactEmail: string;
    allowRegistration: boolean;
    maintenanceMode: boolean;
    logo: string;
    footerText: string;
    currency: string;
    googleAnalyticsId: string;
    socialLinks: {
      twitter: string;
      facebook: string;
      instagram: string;
      linkedin: string;
    };
  };
  loading: boolean;
  onUpdate: (e: React.FormEvent) => void;
  onChange: (settings: AdminSettingsProps["settings"]) => void;
}

export function AdminSettings({
  settings,
  loading,
  onUpdate,
  onChange,
}: AdminSettingsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <form onSubmit={onUpdate}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-card border border-border p-1 rounded-2xl w-full justify-start h-auto gap-1">
              <TabsTrigger value="general" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Globe className="w-4 h-4" /> General
              </TabsTrigger>
              <TabsTrigger value="branding" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Palette className="w-4 h-4" /> Branding
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Twitter className="w-4 h-4" /> Social
              </TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                <Shield className="w-4 h-4" /> Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
                <CardHeader className="py-8 px-8 border-b border-border/50">
                  <CardTitle className="text-2xl font-black">General Configuration</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Site Name</Label>
                      <Input
                        value={settings.siteName}
                        onChange={(e) => onChange({ ...settings, siteName: e.target.value })}
                        className="h-14 rounded-2xl bg-muted/30"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Contact Email</Label>
                      <Input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => onChange({ ...settings, contactEmail: e.target.value })}
                        className="h-14 rounded-2xl bg-muted/30"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Default Currency</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={settings.currency}
                          onChange={(e) => onChange({ ...settings, currency: e.target.value })}
                          className="h-14 rounded-2xl bg-muted/30 pl-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-border/50">
                    <div className="flex items-center justify-between p-6 bg-muted/20 rounded-3xl border border-border/50">
                      <div className="space-y-1">
                        <p className="font-bold">Registration</p>
                        <p className="text-sm text-muted-foreground">Allow new users to create accounts</p>
                      </div>
                      <Switch
                        checked={settings.allowRegistration}
                        onCheckedChange={(v) => onChange({ ...settings, allowRegistration: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/20 rounded-3xl border border-border/50">
                      <div className="space-y-1">
                        <p className="font-bold">Enable Stripe Payments</p>
                        <p className="text-sm text-muted-foreground">Show Stripe as a payment option</p>
                      </div>
                      <Switch
                        checked={(settings as unknown as { stripeEnabled?: boolean }).stripeEnabled ?? true}
                        onCheckedChange={(v) => onChange({ ...settings, stripeEnabled: v } as any)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-muted/20 rounded-3xl border border-border/50">
                      <div className="space-y-1">
                        <p className="font-bold">Enable PayPal</p>
                        <p className="text-sm text-muted-foreground">Show PayPal as a payment option</p>
                      </div>
                      <Switch
                        checked={(settings as unknown as { paypalEnabled?: boolean }).paypalEnabled ?? true}
                        onCheckedChange={(v) => onChange({ ...settings, paypalEnabled: v } as any)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding">
              <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
                <CardHeader className="py-8 px-8 border-b border-border/50">
                  <CardTitle className="text-2xl font-black">Branding & UI</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Logo URL</Label>
                    <Input
                      value={settings.logo}
                      onChange={(e) => onChange({ ...settings, logo: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/30"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider">Footer Copyright Text</Label>
                    <Input
                      value={settings.footerText}
                      onChange={(e) => onChange({ ...settings, footerText: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/30"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
                <CardHeader className="py-8 px-8 border-b border-border/50">
                  <CardTitle className="text-2xl font-black">Social Connections</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
                        <Twitter className="w-4 h-4" /> Twitter
                      </Label>
                      <Input
                        value={settings.socialLinks?.twitter}
                        onChange={(e) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })}
                        className="h-14 rounded-2xl bg-muted/30"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
                        <Facebook className="w-4 h-4" /> Facebook
                      </Label>
                      <Input
                        value={settings.socialLinks?.facebook}
                        onChange={(e) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                        className="h-14 rounded-2xl bg-muted/30"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
                        <Instagram className="w-4 h-4" /> Instagram
                      </Label>
                      <Input
                        value={settings.socialLinks?.instagram}
                        onChange={(e) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                        className="h-14 rounded-2xl bg-muted/30"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </Label>
                      <Input
                        value={settings.socialLinks?.linkedin}
                        onChange={(e) => onChange({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                        className="h-14 rounded-2xl bg-muted/30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card">
                <CardHeader className="py-8 px-8 border-b border-border/50">
                  <CardTitle className="text-2xl font-black">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-sm font-black text-muted-foreground uppercase tracking-wider">
                      <BarChart className="w-4 h-4" /> Google Analytics ID
                    </Label>
                    <Input
                      value={settings.googleAnalyticsId}
                      onChange={(e) => onChange({ ...settings, googleAnalyticsId: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/30"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-destructive/5 rounded-3xl border border-destructive/10">
                    <div className="space-y-1">
                      <p className="font-bold text-destructive flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Maintenance Mode
                      </p>
                      <p className="text-sm text-muted-foreground">Put the entire site into maintenance mode</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(v) => onChange({ ...settings, maintenanceMode: v })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8">
            <Button
              disabled={loading}
              className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black uppercase tracking-widest gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Synchronize System
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-2xl shadow-primary/20 rounded-[32px] bg-primary text-primary-foreground overflow-hidden">
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
              <ShieldCheck className="h-5 w-5" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-3">
              <p className="text-primary-foreground/50 text-[10px] font-black uppercase tracking-[0.2em]">Infrastructure</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Database</span>
                <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-emerald-400">Live</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-primary-foreground/50 text-[10px] font-black uppercase tracking-[0.2em]">Environment</p>
              <div className="flex items-center justify-between">
                <span className="font-bold">Deployment</span>
                <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full border border-white/20">Production</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] p-8 space-y-6 bg-card">
          <h4 className="font-black text-foreground uppercase tracking-widest text-xs opacity-50">Quick Actions</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start font-black text-xs uppercase tracking-widest rounded-xl hover:bg-muted h-14 border-border/50"
            >
              Clear Cache
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start font-black text-xs uppercase tracking-widest rounded-xl hover:bg-destructive/10 h-14 border-border/50 text-destructive hover:text-destructive"
            >
              System Reboot
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
