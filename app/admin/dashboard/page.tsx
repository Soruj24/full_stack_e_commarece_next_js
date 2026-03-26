"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/dashboard/AdminHeader";
import { AdminTabsList } from "@/components/admin/dashboard/AdminTabsList";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { AdminEditUserDialog } from "@/components/admin/dashboard/AdminEditUserDialog";
import { AdminMessageDialog } from "@/components/admin/dashboard/AdminMessageDialog";
import { Admin2FADialog } from "@/components/admin/dashboard/Admin2FADialog";
import { OverviewTabContent } from "@/components/admin/dashboard/OverviewTabContent";
import { UsersTabContent } from "@/components/admin/dashboard/UsersTabContent";
import { InquiriesTabContent } from "@/components/admin/dashboard/InquiriesTabContent";
import { AuditTabContent } from "@/components/admin/dashboard/AuditTabContent";
import { AdminSettings } from "@/components/admin/dashboard/AdminSettings";
import { AnalyticsTabContent } from "@/components/admin/dashboard/AnalyticsTabContent";
import { OrdersTabContent } from "@/components/admin/dashboard/OrdersTabContent";
import { MarketingTabContent } from "@/components/admin/dashboard/MarketingTabContent";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog";
import { useAdminDashboard } from "@/components/admin/dashboard/useAdminDashboard";
import { User } from "@/types";

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "overview";

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(
    null,
  );
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);

  const {
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
    handleDeleteUser,
    handleChangeRole,
    handleUpdateStatus,
    handleDeleteContactMessage,
    handleUpdateSettings,
    setTwoFactorToken,
    setIs2FADialogOpen,
    setup2FA,
    verify2FA,
  } = useAdminDashboard();

  const setTab = (tab: string) => {
    router.push(`/admin/dashboard?tab=${tab}`);
  };

  const handleUpdateUserByAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserForEdit.id,
          name: selectedUserForEdit.name,
          ...((selectedUserForEdit as { bio?: string }).bio
            ? { bio: (selectedUserForEdit as { bio?: string }).bio }
            : {}),
          ...((selectedUserForEdit as { location?: string }).location
            ? {
                location: (selectedUserForEdit as { location?: string })
                  .location,
              }
            : {}),
          ...((selectedUserForEdit as { phoneNumber?: string }).phoneNumber
            ? {
                phoneNumber: (selectedUserForEdit as { phoneNumber?: string })
                  .phoneNumber,
              }
            : {}),
          ...((selectedUserForEdit as { website?: string }).website
            ? { website: (selectedUserForEdit as { website?: string }).website }
            : {}),
          ...((selectedUserForEdit as { designation?: string }).designation
            ? {
                designation: (selectedUserForEdit as { designation?: string })
                  .designation,
              }
            : {}),
          ...((selectedUserForEdit as { socialLinks?: Record<string, string> })
            .socialLinks
            ? {
                socialLinks: (
                  selectedUserForEdit as {
                    socialLinks?: Record<string, string>;
                  }
                ).socialLinks,
              }
            : {}),
        }),
      });

      if (res.ok) {
        setUsers(
          users.map((u) =>
            u.id === selectedUserForEdit.id ? selectedUserForEdit : u,
          ),
        );
        toast.success("User profile updated");
        setIsEditUserDialogOpen(false);
      }
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchUsers={fetchUsers}
        loading={loading}
        setIsInviteDialogOpen={setIsInviteDialogOpen}
      />

      <DashboardStats
        activeUsers={stats?.activeUsers ?? 0}
        totalAdmins={users.filter((u) => u.role === "admin").length}
        bannedUsers={0}
      />

      <Tabs
        value={activeTab}
        onValueChange={setTab}
        className="w-full space-y-6"
      >
        <AdminTabsList activeTab={activeTab} />

        <InviteUserDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
        />

        <AdminEditUserDialog
          open={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          selectedUserForEdit={selectedUserForEdit}
          setSelectedUserForEdit={setSelectedUserForEdit}
          handleUpdateUserByAdmin={handleUpdateUserByAdmin}
        />

        <TabsContent value="overview">
          <OverviewTabContent
            activityData={activityData}
            setup2FA={setup2FA}
            auditLogs={auditLogs}
            stats={stats}
          />

          <Admin2FADialog
            open={is2FADialogOpen}
            onOpenChange={setIs2FADialogOpen}
            twoFactorSetup={twoFactorSetup}
            twoFactorToken={twoFactorToken}
            setTwoFactorToken={setTwoFactorToken}
            verify2FA={verify2FA}
          />
        </TabsContent>

        <TabsContent value="users">
          <UsersTabContent
            filteredUsers={filteredUsers}
            loading={loading}
            onEdit={(user) => {
              setSelectedUserForEdit(user);
              setIsEditUserDialogOpen(true);
            }}
            onChangeRole={handleChangeRole}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteUser}
            onClearSearch={() => setSearchQuery("")}
          />
        </TabsContent>

        <TabsContent value="inquiries">
          <InquiriesTabContent
            contactMessages={contactMessages}
            onDelete={handleDeleteContactMessage}
            onViewFull={(msg) => {
              setSelectedMessage(msg);
              setIsMessageDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTabContent auditLogs={auditLogs} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTabContent />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTabContent />
        </TabsContent>

        <TabsContent value="marketing">
          <MarketingTabContent />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings
            settings={settings}
            loading={settingsLoading}
            onUpdate={handleUpdateSettings}
            onChange={setSettings}
          />
        </TabsContent>

        <AdminMessageDialog
          open={isMessageDialogOpen}
          onOpenChange={setIsMessageDialogOpen}
          selectedMessage={selectedMessage}
        />
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
