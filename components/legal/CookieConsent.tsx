"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:max-w-md animate-in slide-in-from-bottom-4 duration-500">
      <Card className="p-6 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            <Cookie className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">We value your privacy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
            </p>
            <div className="flex gap-2">
              <Button onClick={accept} size="sm" className="flex-1">
                Accept All
              </Button>
              <Button onClick={decline} variant="outline" size="sm" className="flex-1">
                Reject
              </Button>
            </div>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
