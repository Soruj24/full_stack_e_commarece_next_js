import { Switch } from "@/components/ui/switch";
import { Mail, Zap, Settings, ShieldCheck, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PreferencesTabProps {
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
  };
  onUpdate: (key: any, value: boolean) => void;
}

const preferenceItems = [
  { 
    id: "emailNotifications", 
    title: "Email Notifications", 
    desc: "Receive updates about account activity via email.",
    icon: Mail
  },
  { 
    id: "marketingEmails", 
    title: "Marketing Emails", 
    desc: "Stay informed about new features and professional tips.",
    icon: Zap
  },
  { 
    id: "smsNotifications", 
    title: "SMS Notifications", 
    desc: "Get urgent alerts and order updates via text message.",
    icon: Mail // Using Mail as fallback or I could use MessageSquare if available
  },
  { 
    id: "inAppNotifications", 
    title: "In-App Notifications", 
    desc: "Real-time alerts within the platform dashboard.",
    icon: Settings
  },
];

export function PreferencesTab({ preferences, onUpdate }: PreferencesTabProps) {
  const handleExportData = async () => {
    try {
      const res = await fetch("/api/user/export");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Data export started successfully");
      } else {
        toast.error("Failed to export data");
      }
    } catch (err) {
      toast.error("Error exporting data");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("To delete your account, please contact our support team.");
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">App Preferences</h2>
          <p className="text-muted-foreground font-medium mt-1">Customize your experience and notification settings.</p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Settings className="h-7 w-7" />
        </div>
      </div>

      <div className="space-y-6">
        {preferenceItems.map((pref) => (
          <div 
            key={pref.id}
            className="flex items-center justify-between p-6 rounded-[28px] bg-muted/30 border border-border/50 group hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-2xl bg-background flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <pref.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-foreground">{pref.title}</p>
                <p className="text-sm text-muted-foreground font-medium">{pref.desc}</p>
              </div>
            </div>
            <Switch 
              checked={preferences[pref.id as keyof typeof preferences]}
              onCheckedChange={(checked) => onUpdate(pref.id as keyof typeof preferences, checked)}
            />
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-border/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Compliance & Privacy</h3>
            <p className="text-sm text-muted-foreground font-medium">Manage your data and privacy rights under GDPR/CCPA.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[32px] bg-card border border-border/50 flex flex-col items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
              <Download className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black text-lg">Export Personal Data</h4>
              <p className="text-sm text-muted-foreground font-medium mt-1">Download a copy of all your data in JSON format.</p>
            </div>
            <Button onClick={handleExportData} className="mt-2 rounded-xl h-12 font-bold w-full md:w-auto">
              Request Export
            </Button>
          </div>

          <div className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/20 flex flex-col items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-black text-lg text-red-500">Delete Account</h4>
              <p className="text-sm text-muted-foreground font-medium mt-1">Permanently remove your account and all associated data.</p>
            </div>
            <Button onClick={handleDeleteAccount} variant="destructive" className="mt-2 rounded-xl h-12 font-bold w-full md:w-auto">
              Terminate Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
