"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface InstallPromptContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  dismissPrompt: () => void;
}

const InstallPromptContext = createContext<InstallPromptContextType>({
  deferredPrompt: null,
  isInstallable: false,
  isInstalled: false,
  dismissPrompt: () => {},
});

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function useInstallPrompt() {
  return useContext(InstallPromptContext);
}

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!dismissed) {
        setIsInstallable(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [dismissed]);

  const dismissPrompt = () => {
    setDismissed(true);
    setIsInstallable(false);
    setDeferredPrompt(null);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  useEffect(() => {
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      setDismissed(true);
      setIsInstallable(false);
    }
  }, []);

  return (
    <InstallPromptContext.Provider
      value={{ deferredPrompt, isInstallable, isInstalled, dismissPrompt }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
}
