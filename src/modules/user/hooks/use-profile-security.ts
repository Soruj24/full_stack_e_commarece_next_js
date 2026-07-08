"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { changePassword } from "@/modules/user/services/profile-service";

export function useProfileSecurity(onLoadingChange?: (v: boolean) => void) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hasPassword, setHasPassword] = useState(true);

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      onLoadingChange?.(true);
      try {
        await changePassword(currentPassword, newPassword);
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        onLoadingChange?.(false);
      }
    },
    [currentPassword, newPassword, confirmPassword, onLoadingChange]
  );

  return {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    hasPassword, setHasPassword,
    handleChangePassword,
  };
}
