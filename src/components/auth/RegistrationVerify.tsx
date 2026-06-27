"use client";

import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  userEmail: string;
  otp: string;
  error: string;
  isVerifying: boolean;
  onOtpChange: (otp: string) => void;
  onVerify: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function RegistrationVerify({ userEmail, otp, error, isVerifying, onOtpChange, onVerify, onBack }: Props) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest mx-auto">
            Verification
          </motion.div>
          <CardTitle className="text-4xl font-bold tracking-tight">Verify <span className="text-primary">Account</span></CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">
            A verification code has been sent to <br />
            <span className="text-foreground font-bold text-sm mt-2 block">{userEmail}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-bold text-sm ml-2">Verification Failed: {error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider ml-1">Verification Code</Label>
              <Input type="text" placeholder="000000" value={otp}
                onChange={(e) => onOtpChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                className="h-16 text-center text-2xl font-bold rounded-xl bg-background border-border/40 focus:ring-2 focus:ring-primary/10 transition-all tracking-[0.5em]" />
            </div>

            <Button onClick={onVerify} disabled={isVerifying || otp.length !== 6}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group">
              {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span className="relative z-10">Verify Email</span><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" /></>}
            </Button>

            <button onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group">
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />Back to Registration
            </button>
          </div>
        </CardContent>
        <CardFooter className="pb-12 pt-8" />
      </Card>
    </motion.div>
  );
}
