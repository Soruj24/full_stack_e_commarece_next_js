"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

export function RegistrationClosed() {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="w-full border-none shadow-none bg-transparent sm:bg-muted/30 sm:backdrop-blur-md sm:border sm:border-border/40 sm:shadow-2xl sm:rounded-[40px] p-2 overflow-hidden">
        <CardHeader className="space-y-4 pb-10 pt-12 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-bold text-[10px] uppercase tracking-widest mx-auto">Notice</div>
          <CardTitle className="text-4xl font-bold tracking-tight">Registration <span className="text-primary">Closed</span></CardTitle>
          <CardDescription className="text-muted-foreground font-medium text-lg">We are not accepting new registrations at this time.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-8">
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive rounded-2xl p-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-black uppercase tracking-widest text-[10px] ml-2">Notice</AlertTitle>
            <AlertDescription className="font-medium ml-2 mt-1">Please contact the administrator if you believe this is an error.</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="pb-12 pt-8">
          <Button onClick={() => router.push("/")}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
