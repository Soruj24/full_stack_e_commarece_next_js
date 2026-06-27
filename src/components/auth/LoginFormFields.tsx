"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface LoginFormFieldsProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  show2FA: boolean;
  setShowForgot?: (v: boolean) => void;
}

export function LoginFormFields({ onSubmit, isLoading, showPassword, setShowPassword, show2FA, setShowForgot }: LoginFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-wider ml-1">
          Email Address
        </Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required
          disabled={isLoading}
          className="h-14 rounded-xl bg-background border-border/40 focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all text-foreground font-medium px-4" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center ml-1">
          <Label htmlFor="password" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Password
          </Label>
          {!show2FA && setShowForgot && (
            <button type="button" onClick={() => setShowForgot(true)}
              className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors">
              Forgot Password?
            </button>
          )}
        </div>
        <div className="relative group">
          <Input id="password" name="password" type={showPassword ? "text" : "password"}
            placeholder="Enter your password" required disabled={isLoading}
            className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-medium px-6 pr-12" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {show2FA && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Label htmlFor="otp" className="text-xs font-bold text-foreground uppercase tracking-wider ml-1">
            Verification Code
          </Label>
          <Input id="otp" name="otp" type="text" placeholder="000000" required autoFocus
            disabled={isLoading} maxLength={6}
            className="h-20 text-center text-4xl tracking-[0.5em] font-bold rounded-2xl bg-primary/5 border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all" />
          <p className="text-xs text-muted-foreground text-center font-medium">
            Enter the 6-digit code from your authenticator app
          </p>
        </motion.div>
      )}

      <Button type="submit" disabled={isLoading}
        className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group">
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <span className="relative z-10">{show2FA ? "Verify Code" : "Sign In"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </>
        )}
      </Button>
    </form>
  );
}
