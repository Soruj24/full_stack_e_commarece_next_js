"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Clock, DollarSign, Mail, MessageSquare, Bell, User, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const [lang, setLang] = useState("en");
  const [timezone, setTimezone] = useState("utc-5");
  const [showCurrency, setShowCurrency] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background/95">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account preferences
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-primary" />
                  Account Preferences
                </CardTitle>
                <CardDescription>
                  Customize your language, timezone, and display settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="lang" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      Language
                    </Label>
                    <Select value={lang} onValueChange={setLang}>
                      <SelectTrigger id="lang">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tz" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Timezone
                    </Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="tz">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-5">EST (UTC-5)</SelectItem>
                        <SelectItem value="utc-8">PST (UTC-8)</SelectItem>
                        <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="utc+1">CET (UTC+1)</SelectItem>
                        <SelectItem value="utc+5:30">IST (UTC+5:30)</SelectItem>
                        <SelectItem value="utc+9">JST (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="currency" className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Show currency in prices
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display currency symbols next to prices
                    </p>
                  </div>
                  <Switch id="currency" checked={showCurrency} onCheckedChange={setShowCurrency} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch id="email-notif" checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notif" className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      SMS notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive updates via text message
                    </p>
                  </div>
                  <Switch id="sms-notif" checked={smsNotif} onCheckedChange={setSmsNotif} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notif" className="flex items-center gap-2 text-sm font-medium">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      Push notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch id="push-notif" checked={pushNotif} onCheckedChange={setPushNotif} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control what others can see about you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-profile" className="flex items-center gap-2 text-sm font-medium">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      Show profile publicly
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow others to view your public profile
                    </p>
                  </div>
                  <Switch id="show-profile" checked={showProfile} onCheckedChange={setShowProfile} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-email" className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Show email publicly
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch id="show-email" checked={showEmail} onCheckedChange={setShowEmail} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-end"
          >
            <Button size="lg" onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
