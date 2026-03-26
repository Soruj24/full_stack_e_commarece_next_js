"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { User, ContactMessage, IAuditLog } from "@/types";

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
  lowStockCount: number;
}

interface AdminSettings {
  siteName: string;
  contactEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  logo: string;
  footerText: string;
  currency: string;
  googleAnalyticsId: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

interface UseAdminDashboardReturn {
  loading: boolean;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  contactMessages: ContactMessage[];
  auditLogs: IAuditLog[];
  activityData: { date: string; count: number }[];
  stats: AdminStats | undefined;
  settings: AdminSettings;
  setSettings: React.Dispatch<React.SetStateAction<AdminSettings>>;
  settingsLoading: boolean;
  twoFactorSetup: { qrCodeUrl: string; secret: string } | null;
  twoFactorToken: string;
  is2FADialogOpen: boolean;
  filteredUsers: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchUsers: () => Promise<void>;
  fetchContactMessages: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchActivityData: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;
  handleChangeRole: (userId: string, newRole: string) => Promise<void>;
  handleUpdateStatus: (userId: string, newStatus: string) => Promise<void>;
  handleDeleteContactMessage: (id: string) => Promise<void>;
  handleUpdateSettings: (e: React.FormEvent) => Promise<void>;
  setTwoFactorToken: (token: string) => void;
  setIs2FADialogOpen: (open: boolean) => void;
  setup2FA: () => Promise<void>;
  verify2FA: () => Promise<void>;
};

const defaultSettings: AdminSettings = {
  siteName: "User Management System",
  contactEmail: "admin@example.com",
  allowRegistration: true,
  maintenanceMode: false,
  logo: "",
  footerText: "© 2024 User Management System. All rights reserved.",
  currency: "USD",
  googleAnalyticsId: "",
  socialLinks: {
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  },
};

export function useAdminDashboard(): UseAdminDashboardReturn {
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
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContactMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (Array.isArray(data)) {
        setContactMessages(data);
      }
    } catch {
      console.error("Failed to fetch contact messages");
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch {
      console.error("Failed to fetch settings");
    }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch {
      console.error("Failed to fetch audit logs");
    }
  }, []);

  const fetchActivityData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/activity");
      const data = await res.json();
      if (data.success) {
        setActivityData(data.data);
      }
    } catch {
      console.error("Error fetching activity data");
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const data = await res.json();
      if (data.summary) {
        setStats({
          totalRevenue: data.summary.revenue,
          totalOrders: data.summary.orders,
          totalUsers: data.summary.users,
          totalProducts: data.summary.products,
          activeUsers: data.summary.activeUsers,
          lowStockCount: data.summary.lowStockCount,
        });
      }
    } catch {
      console.error("Error fetching analytics");
    }
  }, []);

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        fetchAuditLogs();
        toast.success("User deleted");
      }
    } catch {
      toast.error("Failed to delete user");
    }
  }, [users, fetchAuditLogs]);

  const handleChangeRole = useCallback(async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map((u) =>
          u.id === userId ? { ...u, role: newRole as "admin" | "user" | "moderator" } : u
        ));
        fetchAuditLogs();
        toast.success("Role updated");
      }
    } catch {
      toast.error("Failed to update role");
    }
  }, [users, fetchAuditLogs]);

  const handleUpdateStatus = useCallback(async (userId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
        fetchAuditLogs();
        toast.success(`User ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  }, [users, fetchAuditLogs]);

  const handleDeleteContactMessage = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setContactMessages(contactMessages.filter((m) => m._id !== id));
        toast.success("Message deleted");
      }
    } catch {
      toast.error("Failed to delete message");
    }
  }, [contactMessages]);

  const handleUpdateSettings = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(data.error || "Failed to update settings");
      }
    } catch {
      toast.error("Error updating settings");
    } finally {
      setSettingsLoading(false);
    }
  }, [settings]);

  const setup2FA = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (data.qrCodeUrl) {
        setTwoFactorSetup(data);
        setIs2FADialogOpen(true);
      }
    } catch {
      toast.error("Failed to setup 2FA");
    }
  }, []);

  const verify2FA = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: twoFactorToken }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("2FA enabled successfully");
        setIs2FADialogOpen(false);
        fetchSettings();
      } else {
        toast.error(data.error || "Invalid token");
      }
    } catch {
      toast.error("Error verifying 2FA");
    }
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
    loading,
    users,
    setUsers,
    contactMessages,
    auditLogs,
    activityData,
    stats,
    settings,
    setSettings,
    settingsLoading,
    twoFactorSetup,
    twoFactorToken,
    is2FADialogOpen,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    fetchUsers,
    fetchContactMessages,
    fetchAuditLogs,
    fetchActivityData,
    fetchAnalytics,
    fetchSettings,
    handleDeleteUser,
    handleChangeRole,
    handleUpdateStatus,
    handleDeleteContactMessage,
    handleUpdateSettings,
    setTwoFactorToken,
    setIs2FADialogOpen,
    setup2FA,
    verify2FA,
  };
}