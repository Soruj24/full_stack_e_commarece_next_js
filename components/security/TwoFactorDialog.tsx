"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, QrCode, Loader2 } from "lucide-react";

interface TwoFactorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeUrl: string;
  otpToken: string;
  setOtpToken: (token: string) => void;
  onVerify: () => Promise<void>;
  loading: boolean;
}

export function TwoFactorDialog({
  open,
  onOpenChange,
  qrCodeUrl,
  otpToken,
  setOtpToken,
  onVerify,
  loading
}: TwoFactorDialogProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight text-center">
            Setup Two-Factor Auth
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            Scan the QR code below with your authenticator app.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6 text-center">
          <div className="mx-auto w-48 h-48 bg-white p-4 rounded-2xl shadow-inner border border-border/50 flex items-center justify-center relative">
            {qrCodeUrl ? (
              // In a real app, use a QR code library like qrcode.react
              // For now we'll just show the placeholder or an img if it was a real data URL
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <QrCode className="w-32 h-32 text-black opacity-20" />
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-center block">Enter 6-digit Code</Label>
              <Input 
                className="text-center text-2xl tracking-[0.5em] font-mono h-14 rounded-xl" 
                placeholder="000000" 
                maxLength={6} 
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            onClick={onVerify}
            disabled={loading || otpToken.length !== 6}
            className="rounded-xl px-8 font-black w-full"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Enable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
