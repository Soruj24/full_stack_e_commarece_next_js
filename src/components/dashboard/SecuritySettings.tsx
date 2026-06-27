"use client";

import { useState } from "react";
import { Shield, Key, Lock, Smartphone, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast.success("Password updated successfully");
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="p-6 sm:p-10 bg-card rounded-[32px] sm:rounded-[40px] border border-border/50 shadow-2xl shadow-primary/5">
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <div className="h-12 w-12 sm:h-14 sm:w-14 bg-primary/10 rounded-xl sm:rounded-[22px] flex items-center justify-center text-primary">
                <Key className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Change Password</h3>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Ensure your account is using a long, random password.</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-4">Current Password</label>
                <Input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="h-14 sm:h-16 bg-muted/30 border-border/40 rounded-xl sm:rounded-[20px] px-6 sm:px-8 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-4">New Password</label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="h-14 sm:h-16 bg-muted/30 border-border/40 rounded-xl sm:rounded-[20px] px-6 sm:px-8 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-4">Confirm New Password</label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="h-14 sm:h-16 bg-muted/30 border-border/40 rounded-xl sm:rounded-[20px] px-6 sm:px-8 font-bold text-foreground focus:ring-4 focus:ring-primary/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button
                disabled={loading}
                className="w-full h-14 sm:h-16 rounded-xl sm:rounded-[24px] bg-primary hover:bg-primary/90 font-black text-base sm:text-lg shadow-2xl shadow-primary/25 gap-3 sm:gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 sm:mt-4"
              >
                {loading ? <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin" /> : <Lock className="h-6 w-6 sm:h-7 sm:w-7" />}
                Update Security Credentials
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="p-6 sm:p-10 bg-foreground rounded-[32px] sm:rounded-[40px] shadow-2xl text-background space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 sm:h-14 sm:w-14 bg-primary/10 rounded-xl sm:rounded-[22px] flex items-center justify-center text-primary">
                <Smartphone className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight">Two-Factor Auth</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Recommended</p>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm font-medium text-background/60 leading-relaxed">
              Add an extra layer of security to your account by requiring more than just a password to log in.
            </p>

            <Button variant="outline" className="w-full h-14 sm:h-16 rounded-xl sm:rounded-[24px] border-background/20 hover:bg-background/10 text-background font-black text-sm sm:text-base gap-3 sm:gap-4 group">
              Enable 2FA Protection
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="p-6 sm:p-10 bg-card rounded-[32px] sm:rounded-[40px] border border-border/50 shadow-2xl shadow-primary/5 space-y-5 sm:space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-500/10 rounded-xl sm:rounded-[18px] flex items-center justify-center text-red-500">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">Login Sessions</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-xl sm:rounded-[20px] border border-border/30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full" />
                  <span className="text-[11px] sm:text-xs font-bold">Current Session</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Now</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground text-center">
                You are currently logged in from this browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
