import { useState } from "react";
import { toast } from "sonner";

const giftCardAmounts = [10, 25, 50, 100, 200, 500];

interface GiftCardFormData {
  amount: number;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

export function useGiftCardPurchase() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GiftCardFormData>({
    amount: 0, senderName: "", senderEmail: "", recipientName: "", recipientEmail: "", message: "",
  });
  const [createdCard, setCreatedCard] = useState<{ code: string; amount: number } | null>(null);

  const currentAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setFormData((prev) => ({ ...prev, amount }));
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 1) setFormData((prev) => ({ ...prev, amount: num }));
  };

  const handleInputChange = (field: keyof GiftCardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount < 1) { toast.error("Please select or enter a valid amount"); return; }
    if (!formData.senderName || !formData.senderEmail || !formData.recipientName || !formData.recipientEmail) {
      toast.error("Please fill in all required fields"); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: currentAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create gift card");
      setCreatedCard({ code: data.giftCard.code, amount: data.giftCard.amount });
      toast.success("Gift card created successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create gift card");
    } finally {
      setLoading(false);
    }
  };

  return {
    giftCardAmounts, selectedAmount, customAmount, currentAmount, formData, loading, createdCard,
    handleAmountSelect, handleCustomAmount, handleInputChange, handleSubmit,
  };
}
