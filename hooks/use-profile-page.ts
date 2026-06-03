"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IAddress, IPaymentMethod } from "@/types";

interface SocialLinks {
  twitter: string;
  linkedin: string;
  github: string;
  facebook: string;
}

interface Preferences {
  emailNotifications: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
}

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
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    twitter: "",
    linkedin: "",
    github: "",
    facebook: "",
  });

  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    marketingEmails: false,
    smsNotifications: true,
    inAppNotifications: true,
  });

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

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
    if (!session?.user) return;

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
            }
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
            }
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

    fetchUserData();
  }, [session]);

  const handleUpdateProfile = useCallback(
    async (e: React.FormEvent) => {
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
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [name, bio, location, phoneNumber, website, designation, socialLinks, update, router]
  );

  const handleChangePassword = useCallback(
    async (e: React.FormEvent) => {
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
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [currentPassword, newPassword, confirmPassword]
  );

  const handleUpdatePreferences = useCallback(
    async (key: keyof Preferences, value: boolean) => {
      const previous = { ...preferences };
      setPreferences((prev) => ({ ...prev, [key]: value }));

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
          setPreferences(previous);
          toast.error(data.error || "Failed to update preference");
        } else {
          toast.success("Updated", { duration: 1000 });
        }
      } catch {
        setPreferences(previous);
        toast.error("Network error");
      }
    },
    [preferences]
  );

  const handleUpdateAddresses = useCallback(
    async (newAddresses: IAddress[]) => {
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
    },
    []
  );

  const handleUpdatePaymentMethods = useCallback(
    async (newMethods: IPaymentMethod[]) => {
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
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    session,
    loading,
    fetching,
    activeTab,
    setActiveTab,
    name,
    setName,
    bio,
    setBio,
    location,
    setLocation,
    phoneNumber,
    setPhoneNumber,
    website,
    setWebsite,
    designation,
    setDesignation,
    socialLinks,
    setSocialLinks,
    preferences,
    addresses,
    paymentMethods,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    hasPassword,
    loyaltyPoints,
    referralCode,
    membershipTier,
    totalSpent,
    ordersCount,
    handleUpdateProfile,
    handleChangePassword,
    handleUpdatePreferences,
    handleUpdateAddresses,
    handleUpdatePaymentMethods,
  };
}
