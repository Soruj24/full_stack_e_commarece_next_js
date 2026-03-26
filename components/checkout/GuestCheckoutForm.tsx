"use client";

import { useState } from "react";
import { useGuestCheckout } from "@/context/GuestCheckoutContext";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, UserPlus, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GuestCheckoutFormProps {
  onGuestContinue: (email: string, firstName?: string, lastName?: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  className?: string;
}

export function GuestCheckoutForm({
  onGuestContinue,
  onLogin,
  onRegister,
  className,
}: GuestCheckoutFormProps) {
  const { startGuestCheckout, isGuestCheckout, guestInfo } = useGuestCheckout();
  const { data: session } = useSession();
  const [email, setEmail] = useState(guestInfo?.email || "");
  const [firstName, setFirstName] = useState(guestInfo?.firstName || "");
  const [lastName, setLastName] = useState(guestInfo?.lastName || "");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleGuestContinue = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    
    startGuestCheckout(email);
    onGuestContinue(email, firstName, lastName);
  };

  if (session) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="p-6 bg-green-50 border border-green-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Signed in</p>
              <p className="text-sm text-green-600">{session.user?.email}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          You&apos;re checking out as a registered user. Your order will be linked to your account.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Sign In / Register Option */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onLogin}
          className="h-14 rounded-xl gap-2 font-medium"
        >
          <User className="w-4 h-4" />
          Sign In
        </Button>
        <Button
          variant="outline"
          onClick={onRegister}
          className="h-14 rounded-xl gap-2 font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Create Account
        </Button>
      </div>

      {/* OR Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-muted-foreground">
            or continue as guest
          </span>
        </div>
      </div>

      {/* Guest Checkout Form */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="guest-email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="guest-email"
              type="email"
              placeholder="guest@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-14 rounded-xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We&apos;ll send your order confirmation here
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guest-firstname" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="guest-firstname"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-14 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-lastname" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="guest-lastname"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-14 rounded-xl"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        <Button
          onClick={handleGuestContinue}
          className="w-full h-14 rounded-xl font-medium gap-2"
          disabled={!email || !agreedToTerms}
        >
          Continue as Guest
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Guest Benefits */}
      <div className="p-4 bg-muted/50 rounded-xl space-y-3">
        <p className="text-sm font-medium">Guest Checkout Benefits:</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            No account required
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Track order with email confirmation
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Save time on future checkouts
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Create account after purchase
          </li>
        </ul>
      </div>
    </div>
  );
}
