"use client";

import { User, MapPin, TruckIcon, Package, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/modules/checkout/hooks/use-checkout";
import { CheckoutStepsBar } from "@/components/checkout/CheckoutStepsBar";
import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import {
  CheckoutHeader, CouponForm, OrderSummary, CheckoutNavigation,
  TrustBadges, ReviewOrder, ShippingStep, DeliveryStep, PaymentStep,
} from "@/components/checkout";

const STEPS = [
  { id: "account", label: "Account", icon: User },
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "delivery", label: "Delivery", icon: TruckIcon },
  { id: "review", label: "Review", icon: Package },
  { id: "payment", label: "Payment", icon: CreditCard },
];

export default function CheckoutPage() {
  const {
    currentStep, setCurrentStep, loading, shippingAddress, setShippingAddress,
    selectedRate, setSelectedRate, paymentMethod, setPaymentMethod,
    paymentEnabled, clientSecret, stripeError, transactionId, setTransactionId,
    paymentPhoneNumber, setPaymentPhoneNumber, couponCode, setCouponCode,
    couponDiscount, couponError, applyingCoupon, showOrderSummary, setShowOrderSummary,
    shippingRates, tax, shippingCost, total, totalForGateway, currency, subtotal, cart,
    handleGuestContinue, handleCreateIntent, handleApplyCoupon, handleRemoveCoupon,
    handleNext, handleBack, handlePlaceOrder,
  } = useCheckout();

  const router = useRouter();
  const currentStepId = STEPS[currentStep].id;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-primary/8 blur-[150px] rounded-full" />
      </div>

      <CheckoutHeader />
      <CheckoutStepsBar steps={STEPS} currentStep={currentStep} onStepClick={(i) => i < currentStep && setCurrentStep(i)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6"
              >
                {currentStepId === "account" && (
                  <div className="rounded-3xl bg-card border border-border/30 shadow-lg shadow-black/5 p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">Checkout Options</h2>
                        <p className="text-sm text-muted-foreground font-medium">Sign in or continue as guest</p>
                      </div>
                    </div>
                    <GuestCheckoutForm
                      onGuestContinue={handleGuestContinue}
                      onLogin={() => router.push("/login?redirect=/checkout")}
                      onRegister={() => router.push("/register?redirect=/checkout")}
                    />
                  </div>
                )}

                {currentStepId === "shipping" && (
                  <ShippingStep address={shippingAddress} onChange={setShippingAddress} />
                )}

                {currentStepId === "delivery" && (
                  <DeliveryStep rates={shippingRates} selectedRate={selectedRate} onSelect={setSelectedRate} onBack={handleBack} />
                )}

                {currentStepId === "review" && (
                  <div className="space-y-6">
                    <ReviewOrder
                      cart={cart} shippingAddress={shippingAddress} selectedRate={selectedRate}
                      onEditShipping={() => setCurrentStep(1)} onEditDelivery={() => setCurrentStep(2)}
                      subtotal={subtotal} shippingCost={shippingCost} tax={tax}
                      discount={couponDiscount} total={total} paymentMethod={paymentMethod}
                    />
                    <CouponForm
                      couponCode={couponCode} couponDiscount={couponDiscount} couponError={couponError}
                      applyingCoupon={applyingCoupon} onCouponChange={setCouponCode}
                      onApply={() => handleApplyCoupon(subtotal)} onRemove={handleRemoveCoupon}
                    />
                  </div>
                )}

                {currentStepId === "payment" && (
                  <PaymentStep
                    paymentMethod={paymentMethod} paymentEnabled={paymentEnabled}
                    transactionId={transactionId} paymentPhoneNumber={paymentPhoneNumber}
                    totalForGateway={totalForGateway} clientSecret={clientSecret} stripeError={stripeError}
                    currency={currency} onMethodChange={setPaymentMethod}
                    onTransactionChange={setTransactionId} onPhoneChange={setPaymentPhoneNumber}
                    onCreateIntent={handleCreateIntent}
                    onPayPalApprove={async (_o, t) => { setTransactionId(t || ""); await handlePlaceOrder(); }}
                    onStripeSuccess={(id) => handlePlaceOrder(id)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <CheckoutNavigation
              currentStep={currentStep} currentStepId={currentStepId} paymentMethod={paymentMethod}
              loading={loading} onBack={handleBack} onContinue={handleNext} onPlaceOrder={handlePlaceOrder}
            />
            <TrustBadges />
          </div>

          {/* Sidebar */}
          <OrderSummary
            cart={cart} subtotal={subtotal} couponDiscount={couponDiscount} shippingCost={shippingCost}
            tax={tax} total={total} showOrderSummary={showOrderSummary} onToggle={() => setShowOrderSummary(!showOrderSummary)}
          />
        </div>
      </div>
    </div>
  );
}
