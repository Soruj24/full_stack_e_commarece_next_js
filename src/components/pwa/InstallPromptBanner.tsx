"use client";

import { useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInstallPrompt } from "./InstallPromptContext";

export function InstallPromptBanner() {
  const { deferredPrompt, isInstallable, dismissPrompt } = useInstallPrompt();
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismissPrompt();
      }
    } catch {
      console.error("Install failed");
    } finally {
      setInstalling(false);
    }
  };

  if (!isInstallable) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[380px] z-50 shadow-2xl border-primary/20 animate-in slide-in-from-bottom-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm">Install App</h3>
              <button
                onClick={dismissPrompt}
                className="p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Add ShopPro to your home screen for a better experience
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleInstall} disabled={installing} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                {installing ? "Installing..." : "Install"}
              </Button>
              <Button size="sm" variant="ghost" onClick={dismissPrompt}>
                Not now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
