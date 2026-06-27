"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { User } from "@/types";

export function useEditUserDialog(
  selectedUser: User | null,
  setSelectedUser: (user: User | null) => void,
  onOpenChange: (open: boolean) => void,
  onSuccess: (updatedUser: User) => void,
) {
  const handleUpdateUserByAdmin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          name: selectedUser.name,
          ...(selectedUser as any).bio ? { bio: (selectedUser as any).bio } : {},
          ...(selectedUser as any).location ? { location: (selectedUser as any).location } : {},
          ...(selectedUser as any).phoneNumber ? { phoneNumber: (selectedUser as any).phoneNumber } : {},
          ...(selectedUser as any).website ? { website: (selectedUser as any).website } : {},
          ...(selectedUser as any).designation ? { designation: (selectedUser as any).designation } : {},
          ...(selectedUser as any).socialLinks ? { socialLinks: (selectedUser as any).socialLinks } : {},
        }),
      });
      if (res.ok) {
        onSuccess(selectedUser);
        toast.success("User profile updated");
        onOpenChange(false);
      }
    } catch {
      toast.error("Failed to update user");
    }
  }, [selectedUser, onSuccess, onOpenChange]);

  return { handleUpdateUserByAdmin };
}
