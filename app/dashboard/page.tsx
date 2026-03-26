"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, User as UserIcon, Shield, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { AccountDetails } from "@/components/dashboard/AccountDetails";
import { SecuritySettings } from "@/components/dashboard/SecuritySettings";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam && ["profile", "security", "activity"].includes(tabParam)
      ? tabParam
      : "profile";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 py-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardHeader session={session} />
        </motion.div>

        {/* Quick Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <QuickActions />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <TabsList className="bg-muted/50 p-1.5 rounded-[24px] border border-border/40 backdrop-blur-sm">
                <TabsTrigger
                  value="profile"
                  className="gap-2 rounded-[18px] px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  <UserIcon className="h-4 w-4" />
                  My Profile
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="gap-2 rounded-[18px] px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="gap-2 rounded-[18px] px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-xl data-[state=active]:text-primary font-black uppercase tracking-widest text-[10px] transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  Recent Activity
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                  <ProfileForm />
                </div>
                <div className="lg:col-span-4">
                  <AccountDetails session={session} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 outline-none">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6 outline-none">
              <RecentActivity />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
