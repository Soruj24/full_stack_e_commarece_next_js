"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

interface SecurityTabProps {
  hasPassword?: boolean;
  currentPassword?: string;
  setCurrentPassword?: (val: string) => void;
  newPassword?: string;
  setNewPassword?: (val: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (val: string) => void;
  loading?: boolean;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
}

export function SecurityTab({
  hasPassword,
  currentPassword, setCurrentPassword,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  loading,
  onSubmit
}: SecurityTabProps) {
  
  if (!onSubmit) {
    // Fallback for simple display if no props passed (unlikely in this context)
    return <div>Security Settings</div>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Password & Security</h2>
        <p className="text-muted-foreground font-medium">Manage your password and login security.</p>
      </div>

      <div className="bg-card rounded-[32px] border border-border/50 p-8 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-black tracking-tight">Change Password</h3>
        </div>

        {hasPassword && (
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword?.(e.target.value)}
              className="rounded-xl bg-muted/30" 
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword?.(e.target.value)}
              className="rounded-xl bg-muted/30" 
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword?.(e.target.value)}
              className="rounded-xl bg-muted/30" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-xl px-8 font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
          </Button>
        </div>
      </div>
    </form>
  );
}
