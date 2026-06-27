import { IAddress, IPaymentMethod } from '@/lib/types';

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

export async function fetchProfile() {
  const res = await fetch("/api/user/profile");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch profile");
  return data.user;
}

export async function updateProfile(body: {
  name?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  website?: string;
  designation?: string;
  socialLinks?: SocialLinks;
}) {
  const res = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to update profile");
  return data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch("/api/user/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to change password");
  return data;
}

export async function updateProfilePreferences(preferences: Preferences) {
  const res = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to update preferences");
  return data;
}

export async function updateAddresses(addresses: IAddress[]) {
  const res = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ addresses }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to update addresses");
  return data;
}

export async function updatePaymentMethods(paymentMethods: IPaymentMethod[]) {
  const res = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentMethods }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to update payment methods");
  return data;
}
