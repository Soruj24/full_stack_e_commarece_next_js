"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useLoginForm } from "@/modules/auth/hooks/use-login-form";
import { LoginFormFields } from "./LoginFormFields";
import SocialLogins from "./SocialLogins";
import ForgotPasswordForm from "./ForgotPasswordForm";

const LoginForm = () => {
  const { error, showForgot, setShowForgot, show2FA, showPassword, setShowPassword, isLoading, router, onSubmit } = useLoginForm();

  if (showForgot) {
    return <ForgotPasswordForm onBack={() => setShowForgot(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mx-auto">
            Member Login
          </motion.div>
          <CardTitle className="text-4xl font-bold tracking-tight">Welcome <span className="text-primary">Back</span></CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">
            Sign in to access your account and continue shopping.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-bold text-sm ml-2">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <LoginFormFields onSubmit={onSubmit} isLoading={isLoading} showPassword={showPassword}
            setShowPassword={setShowPassword} show2FA={show2FA} setShowForgot={setShowForgot} />

          <SocialLogins />
        </CardContent>

        <CardFooter className="pb-12 pt-8 justify-center">
          <p className="text-sm font-medium text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button onClick={() => router.push("/register")} className="text-primary font-bold hover:underline underline-offset-4 transition-all">
              Create Account
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
