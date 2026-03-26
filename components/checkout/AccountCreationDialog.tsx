"use client";

import { useState } from "react";
import { useGuestCheckout } from "@/context/GuestCheckoutContext";
import { signIn } from "next-auth/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, ArrowRight, Check, X, Gift, Clock, Shield } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AccountCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
}

export function AccountCreationDialog({ isOpen, onClose, orderId }: AccountCreationDialogProps) {
  const { guestInfo, clearGuestCheckout } = useGuestCheckout();
  const [email, setEmail] = useState(guestInfo?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const handleCreateAccount = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName: guestInfo?.firstName,
          lastName: guestInfo?.lastName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Auto sign in
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Link order to account if provided
          if (orderId) {
            await fetch("/api/orders/link-account", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                email,
              }),
            });
          }
          setStep("success");
        } else {
          toast.success("Account created! Please sign in.");
          onClose();
        }
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    clearGuestCheckout();
    onClose();
  };

  const benefits = [
    { icon: Clock, text: "Track orders easily" },
    { icon: Heart, text: "Save items to wishlist" },
    { icon: Gift, text: "Get exclusive deals" },
    { icon: Shield, text: "Faster checkout next time" },
  ];

  if (step === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <Check className="w-8 h-8 text-green-600" />
          </motion.div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">Welcome!</DialogTitle>
            <DialogDescription>
              Your account has been created successfully. You can now access your orders and enjoy all features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button asChild className="w-full h-12">
              <Link href="/profile/orders">
                View Your Order
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full h-12">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Your Account</DialogTitle>
              <DialogDescription>
                Save your order and unlock exclusive benefits
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Benefits */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-xl">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <benefit.icon className="w-4 h-4 text-primary" />
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="create-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 rounded-xl"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="create-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-12 rounded-xl"
                placeholder="Min. 8 characters"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-12 h-12 rounded-xl"
                placeholder="Confirm your password"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCreateAccount}
            disabled={isLoading || !email || !password || !confirmPassword}
            className="w-full h-12 rounded-xl gap-2"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full h-12 text-muted-foreground"
          >
            Skip for now
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}

import { Heart } from "lucide-react";
