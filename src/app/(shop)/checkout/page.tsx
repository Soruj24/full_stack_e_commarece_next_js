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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <CheckoutHeader />
      <CheckoutStepsBar steps={STEPS} currentStep={currentStep} onStepClick={(i) => i < currentStep && setCurrentStep(i)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {currentStepId === "account" && (
                  <div className="bg-card rounded-3xl border border-border/50 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Checkout Option</h2>
                        <p className="text-sm text-muted-foreground">Sign in or continue as guest</p>
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

          <OrderSummary
            cart={cart} subtotal={subtotal} couponDiscount={couponDiscount} shippingCost={shippingCost}
            tax={tax} total={total} showOrderSummary={showOrderSummary} onToggle={() => setShowOrderSummary(!showOrderSummary)}
          />
        </div>
      </div>
    </div>
  );
}
