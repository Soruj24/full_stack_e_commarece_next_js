"use client";

import { useEffect, useState } from "react";
import { InstallPromptProvider } from "@/components/pwa/InstallPromptContext";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // TODO: Remove console.log or replace with proper logging
          console.log("SW registered:", registration.scope);
          setServiceWorkerReady(true);
        })
        .catch((error) => {
          console.error("SW registration failed:", error);
        });
    }
  }, []);

  return (
    <InstallPromptProvider>
      <div suppressHydrationWarning>
        {children}
      </div>
    </InstallPromptProvider>
  );
}
