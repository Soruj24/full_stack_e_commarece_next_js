"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { User, ContactMessage, IAuditLog } from "@/types";
import type { AdminStats, AdminSettings } from "@/features/admin/services/admin-service";
import * as adminService from "@/features/admin/services/admin-service";

const defaultSettings: AdminSettings = {
  siteName: "User Management System",
  contactEmail: "admin@example.com",
  allowRegistration: true,
  maintenanceMode: false,
  logo: "",
  footerText: "© 2024 User Management System. All rights reserved.",
  currency: "USD",
  googleAnalyticsId: "",
  socialLinks: { twitter: "", facebook: "", instagram: "", linkedin: "" },
};

export function useAdminDashboard() {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [activityData, setActivityData] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState<AdminStats | undefined>(undefined);
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ qrCodeUrl: string; secret: string } | null>(null);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.fetchUsers();
      setUsers(result);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContactMessages = useCallback(async () => {
    try {
      const result = await adminService.fetchContactMessages();
      setContactMessages(result);
    } catch {
      console.error("Failed to fetch contact messages");
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const result = await adminService.fetchSettings();
      if (result) setSettings(result);
    } catch {
      console.error("Failed to fetch settings");
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const result = await adminService.fetchAuditLogs();
      setAuditLogs(result);
    } catch {
      console.error("Failed to fetch audit logs");
    }
  }, []);

  const fetchActivityData = useCallback(async () => {
    try {
      const result = await adminService.fetchActivityData();
      setActivityData(result);
    } catch {
      console.error("Error fetching activity data");
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const result = await adminService.fetchAnalytics();
      if (result) setStats(result);
    } catch {
      console.error("Error fetching analytics");
    }
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const ok = await adminService.deleteUser(userId);
    if (ok) {
      setUsers(users.filter((u) => u.id !== userId));
      fetchAuditLogs();
      toast.success("User deleted");
    } else toast.error("Failed to delete user");
  }, [users, fetchAuditLogs]);

  const handleChangeRole = useCallback(async (userId: string, newRole: string) => {
    const ok = await adminService.changeUserRole(userId, newRole);
    if (ok) {
      setUsers(users.map((u) => u.id === userId ? { ...u, role: newRole as "admin" | "user" | "moderator" } : u));
      fetchAuditLogs();
      toast.success("Role updated");
    } else toast.error("Failed to update role");
  }, [users, fetchAuditLogs]);

  const handleUpdateStatus = useCallback(async (userId: string, newStatus: string) => {
    const ok = await adminService.updateUserStatus(userId, newStatus);
    if (ok) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
      fetchAuditLogs();
      toast.success(`User ${newStatus}`);
    } else toast.error("Failed to update status");
  }, [users, fetchAuditLogs]);

  const handleDeleteContactMessage = useCallback(async (id: string) => {
    const ok = await adminService.deleteContactMessage(id);
    if (ok) {
      setContactMessages(contactMessages.filter((m) => m._id !== id));
      toast.success("Message deleted");
    } else toast.error("Failed to delete message");
  }, [contactMessages]);

  const handleUpdateSettings = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      const data = await adminService.updateSettings(settings);
      if (data.success) toast.success("Settings updated successfully");
      else toast.error(data.error || "Failed to update settings");
    } catch {
      toast.error("Error updating settings");
    } finally {
      setSettingsLoading(false);
    }
  }, [settings]);

  const setup2FA = useCallback(async () => {
    const data = await adminService.setup2FA();
    if (data) {
      setTwoFactorSetup(data);
      setIs2FADialogOpen(true);
    } else toast.error("Failed to setup 2FA");
  }, []);

  const verify2FA = useCallback(async () => {
    const data = await adminService.verify2FA(twoFactorToken);
    if (data.success) {
      toast.success("2FA enabled successfully");
      setIs2FADialogOpen(false);
      fetchSettings();
    } else toast.error(data.error || "Invalid token");
  }, [twoFactorToken, fetchSettings]);

  useEffect(() => {
    if (session?.user?.role === "admin" || session?.user?.role === "ADMIN") {
      fetchUsers();
      fetchContactMessages();
      fetchSettings();
      fetchAuditLogs();
      fetchActivityData();
      fetchAnalytics();
    }
  }, [session, fetchUsers, fetchContactMessages, fetchSettings, fetchAuditLogs, fetchActivityData, fetchAnalytics]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    loading, users, setUsers, contactMessages, auditLogs, activityData,
    stats, settings, setSettings, settingsLoading, twoFactorSetup,
    twoFactorToken, is2FADialogOpen, filteredUsers, searchQuery, setSearchQuery,
    fetchUsers, fetchContactMessages, fetchAuditLogs, fetchActivityData,
    fetchAnalytics, fetchSettings, handleDeleteUser, handleChangeRole,
    handleUpdateStatus, handleDeleteContactMessage, handleUpdateSettings,
    setTwoFactorToken, setIs2FADialogOpen, setup2FA, verify2FA,
  };
}