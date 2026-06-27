export interface GiftCard {
  _id: string;
  code: string;
  amount: number;
  remainingBalance: number;
  currency: string;
  senderName: string;
  senderEmail: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  usedBy: string[];
}

export async function fetchGiftCards(): Promise<GiftCard[]> {
  const res = await fetch("/api/gift-cards");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch");
  return data.giftCards;
}

export async function createGiftCard(form: Record<string, string>): Promise<GiftCard> {
  const res = await fetch("/api/gift-cards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.giftCard;
}

export async function toggleGiftCard(code: string, isActive: boolean): Promise<void> {
  const res = await fetch(`/api/gift-cards/${code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  if (!res.ok) throw new Error("Failed to update gift card");
}

export async function deleteGiftCard(code: string): Promise<void> {
  const res = await fetch(`/api/gift-cards/${code}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete gift card");
}

export function copyCode(code: string) {
  navigator.clipboard.writeText(code);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function isExpired(date: string) {
  return new Date(date) < new Date();
}
