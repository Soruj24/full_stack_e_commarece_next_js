// app/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/app/actions";
import SocialLogins from "./SocialLogins";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { motion, AnimatePresence } from "framer-motion";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (response?.error) {
        if (response.error.message === "2FA_REQUIRED") {
          setShow2FA(true);
        } else {
          setError(response.error.message || "Login failed");
        }
        setIsLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (e: unknown) {
      setIsLoading(false);
      if (e instanceof Error && e.message === "2FA_REQUIRED") {
        setShow2FA(true);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  }

  if (showForgot) {
    return <ForgotPasswordForm onBack={() => setShowForgot(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mx-auto"
          >
            Member Login
          </motion.div>
          <CardTitle className="text-4xl font-bold tracking-tight">
            Welcome <span className="text-primary">Back</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">
            Sign in to access your account and continue shopping.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert
                  variant="destructive"
                  className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6"
                >
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-bold text-sm ml-2">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-xs font-bold text-foreground uppercase tracking-wider ml-1"
              >
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="h-14 rounded-xl bg-background border-border/40 focus:ring-2 focus:ring-primary/10 focus:border-primary/20 transition-all text-foreground font-medium px-4"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold text-foreground uppercase tracking-wider"
                >
                  Password
                </Label>
                {!show2FA && (
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-medium px-6 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {show2FA && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Label
                  htmlFor="otp"
                  className="text-xs font-bold text-foreground uppercase tracking-wider ml-1"
                >
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="000000"
                  required
                  autoFocus
                  disabled={isLoading}
                  maxLength={6}
                  className="h-20 text-center text-4xl tracking-[0.5em] font-bold rounded-2xl bg-primary/5 border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <p className="text-xs text-muted-foreground text-center font-medium">
                  Enter the 6-digit code from your authenticator app
                </p>
              </motion.div>
            )}

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
              >
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

          <SocialLogins />
        </CardContent>

        <CardFooter className="pb-12 pt-8 justify-center">
          <p className="text-sm font-medium text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-primary font-bold hover:underline underline-offset-4 transition-all"
            >
              Create Account
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
