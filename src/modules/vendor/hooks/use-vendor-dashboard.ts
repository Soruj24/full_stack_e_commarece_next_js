"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Vendor, Payout } from "@/modules/vendor/types/vendor";
import {
  fetchVendor,
  fetchPayouts,
  requestPayout,
} from "@/modules/vendor/services/vendor-dashboard-service";

export function useVendorDashboard() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("bank_transfer");
  const [requesting, setRequesting] = useState(false);

  const loadData = useCallback(async () => {
    const [v, p] = await Promise.all([fetchVendor(), fetchPayouts()]);
    setVendor(v);
    setPayouts(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePayoutRequest = useCallback(async () => {
    if (!vendor) return;
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amount > vendor.commissionBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    setRequesting(true);
    try {
      const data = await requestPayout(amount, payoutMethod);
      if (data.success) {
        toast.success("Payout request submitted!");
        setPayoutModalOpen(false);
        setPayoutAmount("");
        loadData();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to submit payout request");
    } finally {
      setRequesting(false);
    }
  }, [vendor, payoutAmount, payoutMethod, loadData]);

  return {
    vendor,
    payouts,
    loading,
    payoutModalOpen,
    setPayoutModalOpen,
    payoutAmount,
    setPayoutAmount,
    payoutMethod,
    setPayoutMethod,
    requesting,
    handlePayoutRequest,
    loadData,
  };
}
