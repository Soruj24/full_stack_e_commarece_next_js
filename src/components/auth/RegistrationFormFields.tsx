"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, Camera, User as UserIcon, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import SocialLogins from "./SocialLogins";

interface Props {
  error: string;
  isLoading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function RegistrationFormFields({ error, isLoading, showPassword, onTogglePassword, onSubmit }: Props) {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-[10px] uppercase tracking-widest mx-auto">
            Create Account
          </motion.div>
          <CardTitle className="text-4xl font-bold tracking-tight">Sign <span className="text-primary">Up</span></CardTitle>
          <CardDescription className="text-muted-foreground text-base">Create your account to get started.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="text-sm ml-2">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex justify-center pb-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-2xl transition-transform group-hover:scale-105 duration-500">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl uppercase"><UserIcon className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center cursor-not-allowed opacity-50 shadow-xl hover:scale-110 active:scale-95 transition-all"
                  title="Image upload disabled (Cloudinary dependency removed)">
                  <Camera className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium ml-1">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading}
                className="h-12 rounded-xl bg-background px-4" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium ml-1">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required disabled={isLoading}
                className="h-12 rounded-xl bg-background px-4" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium ml-1">Password</Label>
              <div className="relative group">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required disabled={isLoading}
                  className="h-12 rounded-xl bg-background px-4 pr-12" />
                <button type="button" onClick={onTogglePassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] mt-4 relative overflow-hidden group">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span className="relative z-10">Sign Up</span><div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" /></>}
            </Button>
          </form>

          <SocialLogins />
        </CardContent>

        <CardFooter className="pb-12 pt-8 justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => router.push("/login")}
              className="text-primary font-medium hover:underline underline-offset-4 transition-all">
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
