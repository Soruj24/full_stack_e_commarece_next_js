"use client";

import { Loader2 } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileBackground } from "@/components/profile/ProfileBackground";
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab";
import { SecurityTab } from "@/components/profile/SecurityTab";
import { PreferencesTab } from "@/components/profile/PreferencesTab";
import { AddressTab } from "@/components/profile/AddressTab";
import { PaymentTab } from "@/components/profile/PaymentTab";
import { OrdersTab } from "@/components/profile/OrdersTab";
import { LoyaltyTab } from "@/components/profile/LoyaltyTab";
import { StatsTab } from "@/components/profile/StatsTab";
import { WishlistTab } from "@/components/profile/WishlistTab";
import { useProfilePage } from "@/modules/user/hooks/use-profile-page";

export default function ProfilePage() {
  const p = useProfilePage();

  if (p.fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10 selection:text-primary">
      <ProfileBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProfileHeader session={p.session} bio={p.bio} location={p.location} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileTabs activeTab={p.activeTab} setActiveTab={p.setActiveTab} />

          <div className="lg:col-span-9">
            <div className="rounded-[40px] bg-card border border-border/50 shadow-2xl shadow-primary/5 p-8 md:p-12">
              <Tabs value={p.activeTab} className="w-full">
                <TabsContent value="profile" className="mt-0 focus-visible:ring-0">
                  <PersonalInfoTab
                    name={p.name} setName={p.setName}
                    designation={p.designation} setDesignation={p.setDesignation}
                    phoneNumber={p.phoneNumber} setPhoneNumber={p.setPhoneNumber}
                    location={p.location} setLocation={p.setLocation}
                    bio={p.bio} setBio={p.setBio}
                    socialLinks={p.socialLinks} setSocialLinks={p.setSocialLinks}
                    loading={p.loading} onSubmit={p.handleUpdateProfile}
                  />
                </TabsContent>
                <TabsContent value="addresses" className="mt-0 focus-visible:ring-0">
                  <AddressTab addresses={p.addresses} onUpdate={p.handleUpdateAddresses} loading={p.loading} />
                </TabsContent>
                <TabsContent value="payment" className="mt-0 focus-visible:ring-0">
                  <PaymentTab paymentMethods={p.paymentMethods} onUpdate={p.handleUpdatePaymentMethods} loading={p.loading} />
                </TabsContent>
                <TabsContent value="orders" className="mt-0 focus-visible:ring-0">
                  <OrdersTab />
                </TabsContent>
                <TabsContent value="loyalty" className="mt-0 focus-visible:ring-0">
                  <LoyaltyTab points={p.loyaltyPoints} referralCode={p.referralCode} tier={p.membershipTier} />
                </TabsContent>
                <TabsContent value="stats" className="mt-0 focus-visible:ring-0">
                  <StatsTab loyaltyPoints={p.loyaltyPoints} ordersCount={p.ordersCount} totalSpent={p.totalSpent} tier={p.membershipTier} />
                </TabsContent>
                <TabsContent value="wishlist" className="mt-0 focus-visible:ring-0">
                  <WishlistTab />
                </TabsContent>
                <TabsContent value="password" className="mt-0 focus-visible:ring-0">
                  <SecurityTab
                    hasPassword={p.hasPassword}
                    currentPassword={p.currentPassword} setCurrentPassword={p.setCurrentPassword}
                    newPassword={p.newPassword} setNewPassword={p.setNewPassword}
                    confirmPassword={p.confirmPassword} setConfirmPassword={p.setConfirmPassword}
                    loading={p.loading} onSubmit={p.handleChangePassword}
                  />
                </TabsContent>
                <TabsContent value="preferences" className="mt-0 focus-visible:ring-0">
                  <PreferencesTab preferences={p.preferences} onUpdate={p.handleUpdatePreferences} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
