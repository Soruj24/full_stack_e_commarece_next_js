"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PasswordFormProps {
  password: string;
  confirmPassword: string;
  message: string;
  error: string;
  loading: boolean;
  onPasswordChange: (v: string) => void;
  onConfirmChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PasswordForm({ password, confirmPassword, message, error, loading, onPasswordChange, onConfirmChange, onSubmit }: PasswordFormProps) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }} className="w-full">
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.3em] mx-auto">
            Identity Reset
          </motion.div>
          <CardTitle className="text-5xl font-black tracking-tighter uppercase italic">New <span className="text-primary">Key.</span></CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">Configure a new access key for your identity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-8 pb-12">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">New Access Key</Label>
                <Input id="password" type="password" value={password}
                  onChange={(e) => onPasswordChange(e.target.value)} placeholder="MINIMUM 8 CHARACTERS"
                  required minLength={8} disabled={loading || !!message}
                  className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-black uppercase text-[11px] tracking-widest px-6" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="confirm" className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">Confirm Access Key</Label>
                <Input id="confirm" type="password" value={confirmPassword}
                  onChange={(e) => onConfirmChange(e.target.value)} placeholder="REPEAT ACCESS KEY"
                  required disabled={loading || !!message}
                  className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-black uppercase text-[11px] tracking-widest px-6" />
              </div>
            </div>

            {message && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Alert variant="default" className="bg-primary/10 border-primary/20 text-primary rounded-2xl p-6">
                  <CheckCircle2 className="h-5 w-5" />
                  <AlertDescription className="font-black uppercase tracking-widest text-[10px] ml-2">{message}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-black uppercase tracking-widest text-[10px] ml-2">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button type="submit" className="w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 relative overflow-hidden group"
              disabled={loading || !!message}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                <>
                  <span className="relative z-10">Update Access Key</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
