"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/context/CartContext";
import { useGuestCheckout } from "@/features/checkout/context/GuestCheckoutContext";
import { useLocalization } from "@/features/common/hooks/LocalizationContext";
import { ShippingAddress, ShippingRate } from "@/features/checkout/types/checkout";
import { getShippingRatesIntl, calculateTaxIntl, validateAddressIntl, validatePhoneBD } from "@/lib/checkout-utils";
import { convertPrice } from "@/lib/localization";
import { fetchPaymentSettings, createPaymentIntent as apiCreateIntent, placeOrder } from "@/features/checkout/services/checkout-service";
import { useCheckoutCoupon } from "./use-checkout-coupon";

const STEPS = [
  { id: "account", label: "Account" }, { id: "shipping", label: "Shipping" },
  { id: "delivery", label: "Delivery" }, { id: "review", label: "Review" }, { id: "payment", label: "Payment" },
];

function defaultAddress(country: string): ShippingAddress {
  return { fullName: "", street: "", city: "", state: "", zipCode: "", country, phone: "", email: "" };
}

export function useCheckout() {
  const { cart, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const { currency, country } = useLocalization();
  const { isGuestCheckout, startGuestCheckout, updateGuestInfo } = useGuestCheckout();
  const coupon = useCheckoutCoupon(currency);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() => defaultAddress(country || "US"));
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentEnabled, setPaymentEnabled] = useState({ stripe: true, paypal: true, cod: true, bkash: true, nagad: true, rocket: true });
  const [pi, setPi] = useState({ clientSecret: "", error: "" });
  const [tx, setTx] = useState({ id: "", phone: "" });
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  useEffect(() => { if (currentStep === 0 && (session || isGuestCheckout)) setCurrentStep(1); }, [session, isGuestCheckout, currentStep]);
  useEffect(() => { if (cart.length === 0) router.push("/cart"); }, [cart, router]);
  useEffect(() => { fetchPaymentSettings().then(setPaymentEnabled); }, []);

  const shippingRates = useMemo(() => {
    if (validateAddressIntl(shippingAddress)) return getShippingRatesIntl(shippingAddress.zipCode, shippingAddress.country, subtotal);
    return [];
  }, [shippingAddress, subtotal]);

  const tax = useMemo(() => calculateTaxIntl(subtotal - coupon.couponDiscount, shippingAddress.country, shippingAddress.state), [subtotal, shippingAddress.country, shippingAddress.state, coupon.couponDiscount]);

  const shippingCost = selectedRate?.rate || 0;
  const total = subtotal - coupon.couponDiscount + shippingCost + tax;
  const totalForGateway = convertPrice(total, currency);

  const handleGuestContinue = useCallback((email: string, firstName?: string, lastName?: string) => {
    startGuestCheckout(email);
    updateGuestInfo({ firstName, lastName });
    setShippingAddress((p) => ({ ...p, email, fullName: firstName && lastName ? `${firstName} ${lastName}` : firstName || "" }));
    setCurrentStep(1);
  }, [startGuestCheckout, updateGuestInfo]);

  const handleCreateIntent = useCallback(async () => {
    setPi({ clientSecret: "", error: "" });
    try {
      const data = await apiCreateIntent(totalForGateway, currency, cart.length);
      if (data.success) setPi({ clientSecret: data.clientSecret ?? "", error: "" });
      else { const msg = data.error || "Failed to initialize payment"; setPi({ clientSecret: "", error: msg }); toast.error(msg); }
    } catch { const msg = "Failed to initialize payment gateway"; setPi({ clientSecret: "", error: msg }); toast.error(msg); }
  }, [totalForGateway, currency, cart.length]);

  useEffect(() => {
    if (currentStep === 3 && paymentMethod === "stripe" && !pi.clientSecret) handleCreateIntent();
  }, [currentStep, paymentMethod, pi.clientSecret, handleCreateIntent]);

  const validateShipping = useCallback(() => {
    if (!shippingAddress.fullName.trim()) { toast.error("Please enter your full name"); return false; }
    if (!shippingAddress.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) { toast.error("Please enter a valid email address"); return false; }
    if (!shippingAddress.phone.trim()) { toast.error("Please enter your phone number"); return false; }
    if (!validateAddressIntl(shippingAddress)) { toast.error("Please enter a valid address and postal code"); return false; }
    return true;
  }, [shippingAddress]);

  const handleNext = useCallback(() => {
    if (currentStep === 1) { if (!validateShipping()) return; if (shippingRates.length === 0) { toast.error("Please enter a valid address"); return; } }
    if (currentStep === 2 && !selectedRate) { toast.error("Please select a shipping method"); return; }
    if (currentStep < STEPS.length - 1) { setCurrentStep((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }, [currentStep, validateShipping, shippingRates, selectedRate]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) { setCurrentStep((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }, [currentStep]);

  const handlePlaceOrder = useCallback(async (paymentIntentId?: string) => {
    if (["bkash", "nagad", "rocket"].includes(paymentMethod)) {
      if (!tx.id || !tx.phone) { toast.error("Please enter Transaction ID and Phone Number"); return; }
      if (!validatePhoneBD(tx.phone)) { toast.error("Please enter a valid BD phone number"); return; }
    }
    setLoading(true);
    try {
      const baseOrderData = {
        items: cart.map((i) => ({ product: i.id, name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
        shippingAddress, currency, paymentMethod,
        paymentIntentId: paymentMethod === "stripe" ? paymentIntentId : undefined,
        transactionId: ["bkash", "nagad", "rocket"].includes(paymentMethod) ? tx.id : undefined,
        paymentPhoneNumber: ["bkash", "nagad", "rocket"].includes(paymentMethod) ? tx.phone : undefined,
        shippingPrice: shippingCost, shippingCarrier: selectedRate?.carrier,
        shippingService: selectedRate?.service, taxPrice: tax,
        totalAmount: total, couponCode: coupon.couponDiscount > 0 ? coupon.couponCode : undefined, discount: coupon.couponDiscount,
      };
      const isGuest = !session && isGuestCheckout;
      const orderData = isGuest ? { ...baseOrderData, email: shippingAddress.email } : baseOrderData;
      const { status, data } = await placeOrder(orderData as Record<string, unknown>, isGuest);
      if (data.success) { toast.success("Order placed successfully!"); clearCart(); router.push(`/orders/confirmation/${data.order._id}`); }
      else if (status === 401) { toast.error("Please sign in to place an order"); router.push("/login?redirect=/checkout"); }
      else toast.error(data.error || "Failed to place order");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  }, [paymentMethod, tx, cart, shippingAddress, currency, shippingCost, selectedRate, tax, total, coupon, session, isGuestCheckout, clearCart, router]);

  return {
    STEPS, currentStep, setCurrentStep, loading, shippingAddress, setShippingAddress,
    selectedRate, setSelectedRate, paymentMethod, setPaymentMethod, paymentEnabled,
    clientSecret: pi.clientSecret, stripeError: pi.error,
    transactionId: tx.id, setTransactionId: (id: string) => setTx((p) => ({ ...p, id })),
    paymentPhoneNumber: tx.phone, setPaymentPhoneNumber: (phone: string) => setTx((p) => ({ ...p, phone })),
    ...coupon, showOrderSummary, setShowOrderSummary, currency,
    shippingRates, tax, shippingCost, total, totalForGateway, subtotal, cart,
    handleGuestContinue, handleCreateIntent, handleNext, handleBack, handlePlaceOrder,
  };
}
