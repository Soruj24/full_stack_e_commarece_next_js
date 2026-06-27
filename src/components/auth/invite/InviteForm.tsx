"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, Loader2, Lock, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InviteFormProps {
  email: string;
  onSubmit: (data: { name: string; password: string }) => Promise<void>;
  loading: boolean;
}

export function InviteForm({ email, onSubmit, loading }: InviteFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await onSubmit({ name: formData.name, password: formData.password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-2xl rounded-[32px] overflow-hidden bg-card">
        <CardHeader className="text-center pt-12">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-foreground">Accept Invitation</CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-2">
            Complete your profile to join the team as <span className="text-primary font-bold">{email}</span>.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-11 h-14 rounded-2xl bg-muted/50 border-border focus:ring-primary font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Set Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-11 h-14 rounded-2xl bg-muted/50 border-border focus:ring-primary font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-black text-muted-foreground uppercase tracking-wider ml-1">
                Confirm Password
              </Label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-11 h-14 rounded-2xl bg-muted/50 border-border focus:ring-primary font-bold"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create My Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-12 pt-6 text-center justify-center">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account? <a href="/login" className="text-primary font-black hover:underline">Log in</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}