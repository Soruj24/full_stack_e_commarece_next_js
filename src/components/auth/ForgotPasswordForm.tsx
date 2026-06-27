// app/login/ForgotPasswordForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

interface Props {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: Props) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage("Check your email for the password reset link.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to send reset email.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-6 pb-10 pt-12 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-[28px] border border-primary/20 shadow-inner">
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold tracking-tight text-foreground">
              Lost <span className="text-primary">Password?</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-base px-4">
              Enter your email and we'll send you a secure link to reset your
              account access.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <Label
                htmlFor="forgot-email"
                className="text-xs font-bold text-foreground/60 ml-1 uppercase tracking-widest"
              >
                Email Address
              </Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                disabled={loading}
                className="h-14 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-medium px-6"
              />
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <Alert
                  variant="default"
                  className="bg-primary/10 border-primary/20 text-primary rounded-2xl p-6"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <AlertDescription className="font-bold tracking-wide text-sm ml-2">
                    {message}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <Alert
                  variant="destructive"
                  className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6"
                >
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-bold tracking-wide text-sm ml-2">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Send Recovery Link"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-12 px-10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 font-bold text-xs uppercase tracking-widest transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ForgotPasswordForm;
