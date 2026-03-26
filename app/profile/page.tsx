"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { IAddress, IPaymentMethod } from "@/types";

import { Loader2 } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { PersonalInfoTab } from "@/components/profile/PersonalInfoTab";
import { SecurityTab } from "@/components/profile/SecurityTab";
import { PreferencesTab } from "@/components/profile/PreferencesTab";
import { AddressTab } from "@/components/profile/AddressTab";
import { PaymentTab } from "@/components/profile/PaymentTab";
import { OrdersTab } from "@/components/profile/OrdersTab";
import { LoyaltyTab } from "@/components/profile/LoyaltyTab";
import { StatsTab } from "@/components/profile/StatsTab";
import { WishlistTab } from "@/components/profile/WishlistTab";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [designation, setDesignation] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    linkedin: "",
    github: "",
    facebook: "",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    smsNotifications: true,
    inAppNotifications: true,
  });

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hasPassword, setHasPassword] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [membershipTier, setMembershipTier] = useState("bronze");
  const [totalSpent, setTotalSpent] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.success) {
          setName(data.user.name);
          setBio(data.user.bio || "");
          setLocation(data.user.location || "");
          setPhoneNumber(data.user.phoneNumber || "");
          setWebsite(data.user.website || "");
          setDesignation(data.user.designation || "");
          setSocialLinks(
            data.user.socialLinks || {
              twitter: "",
              linkedin: "",
              github: "",
              facebook: "",
            },
          );
          setHasPassword(data.user.hasPassword);
          setAddresses(data.user.addresses || []);
          setPaymentMethods(data.user.paymentMethods || []);
          setPreferences(
            data.user.preferences || {
              emailNotifications: true,
              marketingEmails: false,
              smsNotifications: true,
              inAppNotifications: true,
            },
          );
          setLoyaltyPoints(data.user.loyaltyPoints || 0);
          setReferralCode(data.user.referralCode || "");
          setMembershipTier(data.user.membershipTier || "bronze");
          setTotalSpent(data.user.totalSpent || 0);
          setOrdersCount(data.user.ordersCount || 0);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetching(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          bio,
          location,
          phoneNumber,
          website,
          designation,
          socialLinks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await update({ name: data.user.name });
        router.refresh();
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async (
    key: keyof typeof preferences,
    value: boolean,
  ) => {
    // 1. Capture current state for rollback
    const previousPreferences = { ...preferences };

    // 2. Optimistic update using functional state
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: { ...preferences, [key]: value },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        // Rollback on server error
        setPreferences(previousPreferences);
        toast.error(data.error || "Failed to update preference");
      } else {
        toast.success("Updated", { duration: 1000 });
      }
    } catch (error) {
      // Rollback on network error
      setPreferences(previousPreferences);
      toast.error("Network error");
    }
  };

  const handleUpdateAddresses = async (newAddresses: IAddress[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: newAddresses }),
      });
      const data = await res.json();
      if (data.success) {
        setAddresses(data.user.addresses);
        toast.success("Addresses updated");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethods = async (newMethods: IPaymentMethod[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethods: newMethods }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.user.paymentMethods);
        toast.success("Payment methods updated");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/10 selection:text-primary">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProfileHeader session={session} bio={bio} location={location} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Area */}
          <div className="lg:col-span-9">
            <div className="rounded-[40px] bg-card border border-border/50 shadow-2xl shadow-primary/5 p-8 md:p-12">
              <Tabs value={activeTab} className="w-full">
                <TabsContent
                  value="profile"
                  className="mt-0 focus-visible:ring-0"
                >
                  <PersonalInfoTab
                    name={name}
                    setName={setName}
                    designation={designation}
                    setDesignation={setDesignation}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    location={location}
                    setLocation={setLocation}
                    bio={bio}
                    setBio={setBio}
                    socialLinks={socialLinks}
                    setSocialLinks={setSocialLinks}
                    loading={loading}
                    onSubmit={handleUpdateProfile}
                  />
                </TabsContent>

                <TabsContent
                  value="addresses"
                  className="mt-0 focus-visible:ring-0"
                >
                  <AddressTab
                    addresses={addresses}
                    onUpdate={handleUpdateAddresses}
                    loading={loading}
                  />
                </TabsContent>

                <TabsContent
                  value="payment"
                  className="mt-0 focus-visible:ring-0"
                >
                  <PaymentTab
                    paymentMethods={paymentMethods}
                    onUpdate={handleUpdatePaymentMethods}
                    loading={loading}
                  />
                </TabsContent>

                <TabsContent
                  value="orders"
                  className="mt-0 focus-visible:ring-0"
                >
                  <OrdersTab />
                </TabsContent>

                <TabsContent
                  value="loyalty"
                  className="mt-0 focus-visible:ring-0"
                >
                  <LoyaltyTab
                    points={loyaltyPoints}
                    referralCode={referralCode}
                    tier={membershipTier}
                  />
                </TabsContent>

                <TabsContent
                  value="stats"
                  className="mt-0 focus-visible:ring-0"
                >
                  <StatsTab
                    loyaltyPoints={loyaltyPoints}
                    ordersCount={ordersCount}
                    totalSpent={totalSpent}
                    tier={membershipTier}
                  />
                </TabsContent>

                <TabsContent
                  value="wishlist"
                  className="mt-0 focus-visible:ring-0"
                >
                  <WishlistTab />
                </TabsContent>

                <TabsContent
                  value="password"
                  className="mt-0 focus-visible:ring-0"
                >
                  <SecurityTab
                    hasPassword={hasPassword}
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    loading={loading}
                    onSubmit={handleChangePassword}
                  />
                </TabsContent>

                <TabsContent
                  value="preferences"
                  className="mt-0 focus-visible:ring-0"
                >
                  <PreferencesTab
                    preferences={preferences}
                    onUpdate={handleUpdatePreferences}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
