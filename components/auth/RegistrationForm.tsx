"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import {
  AlertCircle,
  Camera,
  User as UserIcon,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const RegistrationForm = () => {
  const router = useRouter();
  const [isRegistrationAllowed, setIsRegistrationAllowed] = useState<
    boolean | null
  >(null);

  const [error, setError] = useState("");
  const [imageUrl] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setIsRegistrationAllowed(data.settings.allowRegistration);
        }
      } catch (error) {
        console.error("Error checking settings:", error);
      }
    };
    checkSettings();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    setOtp(""); // Clear OTP when starting a new registration attempt

    try {
      const formData = new FormData(event.currentTarget);

      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim().toLowerCase();
      const password = formData.get("password")?.toString();

      if (!name || !email || !password) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          image: imageUrl,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        if (data.email) {
          setUserEmail(data.email as string);
          setStep("verify");
        } else {
          router.push("/login?registered=true");
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (e) {
      setError("Something went wrong");
      console.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?verified=true");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setIsVerifying(false);
    }
  }

  if (isRegistrationAllowed === false && step !== "verify") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
          <CardHeader className="space-y-4 pb-10 pt-12 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-bold text-[10px] uppercase tracking-widest mx-auto">
              Notice
            </div>
            <CardTitle className="text-4xl font-bold tracking-tight">
              Registration <span className="text-primary">Closed</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-lg">
              We are not accepting new registrations at this time.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-8">
            <Alert
              variant="destructive"
              className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-black uppercase tracking-widest text-[10px] ml-2">
                Notice
              </AlertTitle>
              <AlertDescription className="font-medium ml-2 mt-1">
                Please contact the administrator if you believe this is an
                error.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="pb-12 pt-8">
            <Button
              onClick={() => router.push("/")}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (step === "verify") {
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
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest mx-auto"
            >
              Verification
            </motion.div>
            <CardTitle className="text-4xl font-bold tracking-tight">
              Verify <span className="text-primary">Account</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium text-lg">
              A verification code has been sent to <br />
              <span className="text-foreground font-bold text-sm mt-2 block">
                {userEmail}
              </span>
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
                      Verification Failed: {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider ml-1">
                  Verification Code
                </Label>
                <Input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                  }
                  className="h-16 text-center text-2xl font-bold rounded-xl bg-background border-border/40 focus:ring-2 focus:ring-primary/10 transition-all tracking-[0.5em]"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isVerifying || otp.length !== 6}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden group"
              >
                {isVerifying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Verify Email</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </>
                )}
              </Button>

              <button
                onClick={() => setStep("register")}
                className="w-full flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                Back to Registration
              </button>
            </div>
          </CardContent>
          <CardFooter className="pb-12 pt-8" />
        </Card>
      </motion.div>
    );
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
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest mx-auto"
          >
            Create Account
          </motion.div>
          <CardTitle className="text-4xl font-bold tracking-tight">
            Sign <span className="text-primary">Up</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">
            Create your account to get started.
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
                  <AlertDescription className="font-black uppercase tracking-widest text-[10px] ml-2">
                    Provisioning Error: {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center pb-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-2xl transition-transform group-hover:scale-105 duration-500">
                  <AvatarImage src={imageUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-xl uppercase">
                    <UserIcon className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center cursor-not-allowed opacity-50 shadow-xl hover:scale-110 active:scale-95 transition-all"
                  title="Image upload disabled (Cloudinary dependency removed)"
                >
                  <Camera className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="name"
                className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1"
              >
                Legal Designation
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="FULL NAME / ENTITY"
                required
                disabled={isLoading}
                className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-black uppercase text-[11px] tracking-widest px-6"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1"
              >
                Identity Endpoint
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="IDENTITY@DOMAIN.IO"
                required
                disabled={isLoading}
                className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-black uppercase text-[11px] tracking-widest px-6"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1"
              >
                Access Key
              </Label>
              <div className="relative group">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading}
                  className="h-16 rounded-2xl bg-background border-border/40 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all text-foreground font-black tracking-[0.5em] px-6"
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4 relative overflow-hidden group"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">
                    Sign Up
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </Button>
          </form>

          <SocialLogins />
        </CardContent>

        <CardFooter className="pb-12 pt-8 justify-center">
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Existing Identity?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-primary hover:underline underline-offset-4 decoration-2 transition-all"
            >
              Authorize Uplink
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RegistrationForm;
