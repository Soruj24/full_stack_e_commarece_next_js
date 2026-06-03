"use client";

import { useVendorDashboard } from "@/hooks/use-vendor-dashboard";
import { VendorStatusViews } from "@/components/vendor/VendorStatusViews";
import { VendorDashboardContent } from "@/components/vendor/VendorDashboardContent";
import { PayoutModal } from "@/components/vendor/PayoutModal";

export default function VendorDashboardPage() {
  const {
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
  } = useVendorDashboard();

  if (loading || !vendor || vendor.status !== "approved") {
    return <VendorStatusViews loading={loading} vendor={vendor} />;
  }

  return (
    <>
      <VendorDashboardContent
        vendor={vendor}
        payouts={payouts}
        onRequestPayout={() => setPayoutModalOpen(true)}
      />
      <PayoutModal
        open={payoutModalOpen}
        onOpenChange={setPayoutModalOpen}
        balance={vendor.commissionBalance}
        amount={payoutAmount}
        onAmountChange={setPayoutAmount}
        paymentMethod={payoutMethod}
        onPaymentMethodChange={setPayoutMethod}
        requesting={requesting}
        onSubmit={handlePayoutRequest}
      />
    </>
  );
}
