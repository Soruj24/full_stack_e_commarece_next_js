"use client";

import { Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function InviteInvalid() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-2xl rounded-[32px] overflow-hidden bg-card">
        <CardHeader className="text-center pt-12">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-black text-foreground">Invalid Invitation</CardTitle>
          <CardDescription className="text-muted-foreground font-medium mt-2">
            This invitation link is invalid or has expired. Please contact your administrator.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pb-12 pt-6">
          <Button onClick={() => router.push("/")} className="w-full h-14 rounded-2xl font-black text-lg shadow-lg transition-all hover:scale-[1.02]">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}