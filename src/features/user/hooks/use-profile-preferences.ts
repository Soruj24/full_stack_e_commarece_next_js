"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { updateProfilePreferences as serviceUpdatePreferences } from "@/features/user/services/profile-service";

interface Preferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
}

export function useProfilePreferences() {
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    marketingEmails: false,
    smsNotifications: true,
    inAppNotifications: true,
  });

  const handleUpdatePreferences = useCallback(
    async (key: keyof Preferences, value: boolean) => {
      const previous = { ...preferences };
      setPreferences((prev) => ({ ...prev, [key]: value }));
      try {
        await serviceUpdatePreferences({ ...preferences, [key]: value });
        toast.success("Updated", { duration: 1000 });
      } catch (err) {
        setPreferences(previous);
        toast.error(err instanceof Error ? err.message : "Network error");
      }
    },
    [preferences]
  );

  return { preferences, setPreferences, handleUpdatePreferences };
}
