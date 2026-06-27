"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface GiftCardSuccessProps {
  code: string;
  amount: number;
  recipientName: string;
}

export function GiftCardSuccess({ code, amount, recipientName }: GiftCardSuccessProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Gift Card Created!</h2>
            <p className="text-muted-foreground mb-8">Your digital gift card has been created and is ready to use.</p>
            <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl p-8 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Gift Card Code</p>
              <p className="text-3xl font-mono font-bold tracking-wider mb-4">{code}</p>
              <p className="text-2xl font-bold text-primary">${amount.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Share this code with {recipientName || "the recipient"} so they can use it at checkout.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => { navigator.clipboard.writeText(code); toast.success("Code copied!"); }}>
                Copy Code
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
