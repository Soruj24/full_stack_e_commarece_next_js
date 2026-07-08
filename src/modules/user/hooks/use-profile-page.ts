"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { IAddress, IPaymentMethod } from "@/shared/types";
import { fetchProfile, updateProfile } from "@/modules/user/services/profile-service";
import { useProfileSecurity } from "./use-profile-security";
import { useProfilePreferences } from "./use-profile-preferences";
import { useProfileAddresses } from "./use-profile-addresses";

export function useProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [designation, setDesignation] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "", linkedin: "", github: "", facebook: "",
  });

  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [membershipTier, setMembershipTier] = useState("bronze");
  const [totalSpent, setTotalSpent] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  const security = useProfileSecurity(setLoading);
  const preferences = useProfilePreferences();
  const addressBook = useProfileAddresses(setLoading);

  useEffect(() => {
    if (!session?.user) return;

    const loadUserData = async () => {
      try {
        const user = await fetchProfile();
        setName(user.name);
        setBio(user.bio || "");
        setLocation(user.location || "");
        setPhoneNumber(user.phoneNumber || "");
        setWebsite(user.website || "");
        setDesignation(user.designation || "");
        setSocialLinks(user.socialLinks || { twitter: "", linkedin: "", github: "", facebook: "" });
        security.setHasPassword(user.hasPassword);
        addressBook.setAddresses(user.addresses || []);
        addressBook.setPaymentMethods(user.paymentMethods || []);
        preferences.setPreferences(user.preferences || {
          emailNotifications: true, marketingEmails: false, smsNotifications: true, inAppNotifications: true,
        });
        setLoyaltyPoints(user.loyaltyPoints || 0);
        setReferralCode(user.referralCode || "");
        setMembershipTier(user.membershipTier || "bronze");
        setTotalSpent(user.totalSpent || 0);
        setOrdersCount(user.ordersCount || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetching(false);
      }
    };

    loadUserData();
  }, [session]);

  const handleUpdateProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        const data = await updateProfile({
          name, bio, location, phoneNumber, website, designation, socialLinks,
        });
        await update({ name: data.user.name });
        router.refresh();
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [name, bio, location, phoneNumber, website, designation, socialLinks, update, router]
  );

  return {
    ...security, ...preferences, ...addressBook,
    session, loading, fetching, activeTab, setActiveTab,
    name, setName, bio, setBio, location, setLocation,
    phoneNumber, setPhoneNumber, website, setWebsite, designation, setDesignation,
    socialLinks, setSocialLinks,
    loyaltyPoints, referralCode, membershipTier, totalSpent, ordersCount,
    handleUpdateProfile,
  };
}
