"use client";

import { useCart } from "@/context/CartContext";
import { useGuestCheckout } from "@/context/GuestCheckoutContext";
import {
  User,
  MapPin,
  Truck as TruckIcon,
  Package,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  getShippingRatesIntl,
  calculateTaxIntl,
  validateAddressIntl,
  validatePhoneBD,
  ShippingRate,
} from "@/lib/checkout-utils";
import { useLocalization } from "@/context/LocalizationContext";
import { convertPrice, formatPrice } from "@/lib/localization";
import { motion, AnimatePresence } from "framer-motion";
import { GuestCheckoutForm } from "@/components/checkout/GuestCheckoutForm";
import {
  CheckoutHeader,
  CouponForm,
  OrderSummary,
  CheckoutNavigation,
  TrustBadges,
  ReviewOrder,
  ShippingStep,
  DeliveryStep,
  PaymentStep,
} from "@/components/checkout";

const STEPS = [
  { id: "account", label: "Account", icon: User },
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "delivery", label: "Delivery", icon: TruckIcon },
  { id: "review", label: "Review", icon: Package },
  { id: "payment", label: "Payment", icon: CreditCard },
];

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const { currency, country } = useLocalization();
  const { isGuestCheckout, startGuestCheckout, updateGuestInfo } =
    useGuestCheckout();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [stripeError, setStripeError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentPhoneNumber, setPaymentPhoneNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: country || "US",
    phone: "",
    email: "",
  });

  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentEnabled, setPaymentEnabled] = useState<{
    stripe: boolean;
    paypal: boolean;
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    rocket: boolean;
  }>({
    stripe: true,
    paypal: true,
    cod: true,
    bkash: true,
    nagad: true,
    rocket: true,
  });

  useEffect(() => {
    if (currentStep === 0 && (session || isGuestCheckout)) {
      setCurrentStep(1);
    }
  }, [session, isGuestCheckout, currentStep]);

  const shippingRates = useMemo(() => {
    if (validateAddressIntl(shippingAddress)) {
      return getShippingRatesIntl(
        shippingAddress.zipCode,
        shippingAddress.country,
        subtotal,
      );
    }
    return [];
  }, [
    shippingAddress.street,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.zipCode,
    shippingAddress.country,
    subtotal,
  ]);

  const tax = useMemo(() => {
    return calculateTaxIntl(
      subtotal - couponDiscount,
      shippingAddress.country,
      shippingAddress.state,
    );
  }, [
    subtotal,
    shippingAddress.country,
    shippingAddress.state,
    couponDiscount,
  ]);

  const shippingCost = selectedRate?.rate || 0;
  const total = subtotal - couponDiscount + shippingCost + tax;
  const totalForGateway = convertPrice(total, currency);

  const handleGuestContinue = (
    email: string,
    firstName?: string,
    lastName?: string,
  ) => {
    startGuestCheckout(email);
    updateGuestInfo({ firstName, lastName });
    setShippingAddress((prev) => ({
      ...prev,
      email,
      fullName:
        firstName && lastName ? `${firstName} ${lastName}` : firstName || "",
    }));
    setCurrentStep(1);
  };

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          setPaymentEnabled({
            stripe: (data.settings?.stripeEnabled ?? true) as boolean,
            paypal: (data.settings?.paypalEnabled ?? true) as boolean,
            cod: (data.settings?.codEnabled ?? true) as boolean,
            bkash: (data.settings?.bkashEnabled ?? true) as boolean,
            nagad: (data.settings?.nagadEnabled ?? true) as boolean,
            rocket: (data.settings?.rocketEnabled ?? true) as boolean,
          });
        }
      } catch {
        // Silent fail
      }
    };
    fetchPublicSettings();
  }, []);

  useEffect(() => {
    if (currentStep === 3 && paymentMethod === "stripe" && !clientSecret) {
      createPaymentIntent();
    }
  }, [currentStep, paymentMethod, clientSecret]);

  const createPaymentIntent = async () => {
    setStripeError("");
    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalForGateway,
          currency: currency.toLowerCase(),
          metadata: { orderItems: cart.length },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setClientSecret(data.clientSecret);
      } else {
        const errorMsg = data.error || "Failed to initialize payment";
        setStripeError(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = "Failed to initialize payment gateway";
      setStripeError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();

      if (data.success) {
        setCouponDiscount(data.discount);
        toast.success(
          `Coupon applied! You save ${formatPrice(convertPrice(data.discount, currency), currency)}`,
        );
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
  };

  const validateShipping = () => {
    if (!shippingAddress.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (
      !shippingAddress.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)
    ) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!shippingAddress.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!validateAddressIntl(shippingAddress)) {
      toast.error("Please enter a valid address and postal code");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateShipping()) {
        return;
      }
      if (shippingRates.length === 0) {
        toast.error("Please enter a valid address to see shipping options");
        return;
      }
    }
    if (currentStep === 2 && !selectedRate) {
      toast.error("Please select a shipping method");
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePlaceOrder = async (paymentIntentId?: string) => {
    // Validate mobile payments
    if (["bkash", "nagad", "rocket"].includes(paymentMethod)) {
      if (!transactionId || !paymentPhoneNumber) {
        toast.error("Please enter Transaction ID and Phone Number");
        return;
      }
      if (!validatePhoneBD(paymentPhoneNumber)) {
        toast.error("Please enter a valid BD phone number");
        return;
      }
    }

    // COD doesn't need any payment verification
    if (paymentMethod === "cod") {
      paymentIntentId = undefined;
    }

    setLoading(true);
    try {
      const baseOrderData = {
        items: cart.map((i) => ({
          product: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        shippingAddress,
        currency,
        paymentMethod,
        paymentIntentId: paymentMethod === "stripe" ? paymentIntentId : undefined,
        transactionId: ["bkash", "nagad", "rocket"].includes(paymentMethod)
          ? transactionId
          : undefined,
        paymentPhoneNumber: ["bkash", "nagad", "rocket"].includes(
          paymentMethod,
        )
          ? paymentPhoneNumber
          : undefined,
        shippingPrice: shippingCost,
        shippingCarrier: selectedRate?.carrier,
        shippingService: selectedRate?.service,
        taxPrice: tax,
        totalAmount: total,
        couponCode: couponDiscount > 0 ? couponCode : undefined,
        discount: couponDiscount,
      };

      // Use guest or authenticated order API
      const isGuest = !session && isGuestCheckout;
      const endpoint = isGuest ? "/api/orders/guest" : "/api/orders";
      
      const orderData = isGuest
        ? { ...baseOrderData, email: shippingAddress.email }
        : baseOrderData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/orders/confirmation/${data.order._id}`);
      } else {
        if (res.status === 401) {
          toast.error("Please sign in to place an order");
          router.push("/login?redirect=/checkout");
        } else {
          toast.error(data.error || "Failed to place order");
        }
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const currentStepId = STEPS[currentStep].id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <CheckoutHeader />

      <div className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isCompleted && setCurrentStep(index)}
                    disabled={!isCompleted && !isActive}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
                      isActive && "bg-primary text-primary-foreground",
                      isCompleted &&
                        "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer",
                      !isActive &&
                        !isCompleted &&
                        "text-muted-foreground cursor-not-allowed",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        isActive && "bg-white/20",
                        isCompleted && "bg-green-500 text-white",
                        !isActive && !isCompleted && "bg-muted",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-semibold text-sm hidden sm:inline">
                      {step.label}
                    </span>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "w-12 sm:w-20 h-0.5 mx-2",
                        isCompleted ? "bg-green-500" : "bg-muted",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
                        <p className="text-sm text-muted-foreground">
                          Sign in or continue as guest
                        </p>
                      </div>
                    </div>
                    <GuestCheckoutForm
                      onGuestContinue={handleGuestContinue}
                      onLogin={() => router.push("/login?redirect=/checkout")}
                      onRegister={() =>
                        router.push("/register?redirect=/checkout")
                      }
                    />
                  </div>
                )}

                {currentStepId === "shipping" && (
                  <ShippingStep
                    address={shippingAddress}
                    onChange={setShippingAddress}
                  />
                )}

                {currentStepId === "delivery" && (
                  <DeliveryStep
                    rates={shippingRates}
                    selectedRate={selectedRate}
                    onSelect={setSelectedRate}
                    onBack={handleBack}
                  />
                )}

                {currentStepId === "review" && (
                  <div className="space-y-6">
                    <ReviewOrder
                      cart={cart}
                      shippingAddress={shippingAddress}
                      selectedRate={selectedRate}
                      onEditShipping={() => setCurrentStep(1)}
                      onEditDelivery={() => setCurrentStep(2)}
                      subtotal={subtotal}
                      shippingCost={shippingCost}
                      tax={tax}
                      discount={couponDiscount}
                      total={total}
                      paymentMethod={paymentMethod}
                    />
                    <CouponForm
                      couponCode={couponCode}
                      couponDiscount={couponDiscount}
                      couponError={couponError}
                      applyingCoupon={applyingCoupon}
                      onCouponChange={setCouponCode}
                      onApply={handleApplyCoupon}
                      onRemove={handleRemoveCoupon}
                    />
                  </div>
                )}

                {currentStepId === "payment" && (
                  <PaymentStep
                    paymentMethod={paymentMethod}
                    paymentEnabled={paymentEnabled}
                    transactionId={transactionId}
                    paymentPhoneNumber={paymentPhoneNumber}
                    totalForGateway={totalForGateway}
                    clientSecret={clientSecret}
                    stripeError={stripeError}
                    currency={currency}
                    onMethodChange={setPaymentMethod}
                    onTransactionChange={setTransactionId}
                    onPhoneChange={setPaymentPhoneNumber}
                    onCreateIntent={createPaymentIntent}
                    onPayPalApprove={async (_orderId, txnId) => {
                      setTransactionId(txnId || "");
                      await handlePlaceOrder();
                    }}
                    onStripeSuccess={(id) => handlePlaceOrder(id)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <CheckoutNavigation
              currentStep={currentStep}
              currentStepId={currentStepId}
              paymentMethod={paymentMethod}
              loading={loading}
              onBack={handleBack}
              onContinue={handleNext}
              onPlaceOrder={handlePlaceOrder}
            />

            <TrustBadges />
          </div>

          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            couponDiscount={couponDiscount}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            showOrderSummary={showOrderSummary}
            onToggle={() => setShowOrderSummary(!showOrderSummary)}
          />
        </div>
      </div>
    </div>
  );
}
