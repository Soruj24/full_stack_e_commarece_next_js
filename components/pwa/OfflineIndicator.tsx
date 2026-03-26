"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function OfflineIndicator() {
  const [wasOffline, setWasOffline] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success("You're back online!", {
          description: "Refreshing data...",
        });
        window.location.reload();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.error("You're offline", {
        description: "Some features may be limited",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-950 px-4 py-2 text-center text-sm font-medium z-50 flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        You&apos;re offline - Some features are limited
      </div>
    );
  }

  return null;
}
