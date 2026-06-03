"use client";

import { Button } from "@/components/ui/button";
import { Globe, Palette, Twitter, Shield, RefreshCcw, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsGeneralTab } from "./settings/SettingsGeneralTab";
import { SettingsBrandingTab } from "./settings/SettingsBrandingTab";
import { SettingsSocialTab } from "./settings/SettingsSocialTab";
import { SettingsAdvancedTab } from "./settings/SettingsAdvancedTab";

interface AdminSettingsData {
  siteName: string; contactEmail: string; allowRegistration: boolean; maintenanceMode: boolean;
  logo: string; footerText: string; currency: string; googleAnalyticsId: string;
  socialLinks: { twitter: string; facebook: string; instagram: string; linkedin: string; };
}

interface AdminSettingsProps {
  settings: AdminSettingsData;
  loading: boolean;
  onUpdate: (e: React.FormEvent) => void;
  onChange: (settings: AdminSettingsData) => void;
}

export function AdminSettings({ settings, loading, onUpdate, onChange }: AdminSettingsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <form onSubmit={onUpdate}>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-card border border-border p-1 rounded-2xl w-full justify-start h-auto gap-1">
              <TabsTrigger value="general" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"><Globe className="w-4 h-4" /> General</TabsTrigger>
              <TabsTrigger value="branding" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"><Palette className="w-4 h-4" /> Branding</TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"><Twitter className="w-4 h-4" /> Social</TabsTrigger>
              <TabsTrigger value="advanced" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"><Shield className="w-4 h-4" /> Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="general"><SettingsGeneralTab settings={settings} onChange={onChange} /></TabsContent>
            <TabsContent value="branding"><SettingsBrandingTab settings={settings} onChange={onChange} /></TabsContent>
            <TabsContent value="social"><SettingsSocialTab settings={settings} onChange={onChange} /></TabsContent>
            <TabsContent value="advanced"><SettingsAdvancedTab settings={settings} onChange={onChange} /></TabsContent>
          </Tabs>
          <div className="flex justify-end mt-8">
            <Button disabled={loading} className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 font-black uppercase tracking-widest gap-3 transition-all hover:scale-[1.02] active:scale-95">
              {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              Synchronize System
            </Button>
          </div>
        </form>
      </div>
      <div className="space-y-6">
        <Card className="border-none shadow-2xl shadow-primary/20 rounded-[32px] bg-primary text-primary-foreground overflow-hidden">
          <CardHeader className="pb-4 border-b border-white/10">
            <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tight"><ShieldCheck className="h-5 w-5" /> System Status</CardTitle>
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
            <Button variant="outline" className="w-full justify-start font-black text-xs uppercase tracking-widest rounded-xl hover:bg-muted h-14 border-border/50">Clear Cache</Button>
            <Button variant="outline" className="w-full justify-start font-black text-xs uppercase tracking-widest rounded-xl hover:bg-destructive/10 h-14 border-border/50 text-destructive hover:text-destructive">System Reboot</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
