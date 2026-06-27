
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Admin2FADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  twoFactorSetup: { qrCodeUrl: string; secret: string } | null;
  twoFactorToken: string;
  setTwoFactorToken: (token: string) => void;
  verify2FA: () => void;
}

export function Admin2FADialog({
  open,
  onOpenChange,
  twoFactorSetup,
  twoFactorToken,
  setTwoFactorToken,
  verify2FA,
}: Admin2FADialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">
            Setup Two-Factor Authentication
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          {twoFactorSetup?.qrCodeUrl && (
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <Image
                src={twoFactorSetup.qrCodeUrl}
                alt="2FA QR Code"
                width={200}
                height={200}
                className="w-48 h-48"
              />
            </div>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              Scan this QR code with your authenticator app (like Google Authenticator or Authy).
            </p>
            {twoFactorSetup?.secret && (
              <p className="text-xs text-muted-foreground/70 font-mono bg-muted p-2 rounded-lg break-all">
                Secret: {twoFactorSetup.secret}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="token" className="text-sm font-bold text-muted-foreground ml-1">
              Enter Verification Code
            </Label>
            <Input
              id="token"
              placeholder="e.g. 123456"
              value={twoFactorToken}
              onChange={(e) => setTwoFactorToken(e.target.value)}
              className="h-12 rounded-xl bg-muted/50 border-none text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl font-bold flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={verify2FA}
            disabled={!twoFactorToken || twoFactorToken.length < 6}
            className="bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20 flex-1"
          >
            Verify & Enable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
