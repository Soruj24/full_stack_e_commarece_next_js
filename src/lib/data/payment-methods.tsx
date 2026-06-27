import { CreditCard } from "lucide-react";
import type { ReactNode } from "react";

export const PAYMENT_ICONS: Record<string, ReactNode> = {
  stripe: <CreditCard className="w-6 h-6" />,
  paypal: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.64h6.803c2.235 0 3.955.46 5.13 1.374 1.18.917 1.702 2.25 1.564 3.99-.076.945-.286 1.814-.63 2.605-.341.795-.831 1.492-1.457 2.1-.623.606-1.42 1.073-2.377 1.402-.957.33-2.097.496-3.402.496H9.138c-.39 0-.727.28-.789.667l-.72 4.327-1.575-.001-.03.175Zm8.65-11.78c1.63 0 2.775-.23 3.432-.69.654-.458.981-1.14.981-2.045 0-.47-.113-.862-.337-1.176-.223-.313-.584-.543-1.076-.69a5.17 5.17 0 0 0-1.646-.23H10.52l-.045.273v5.57l.03.273h2.07c.59 0 1.056-.06 1.39-.18.335-.12.578-.3.728-.54.15-.24.225-.53.225-.87 0-.48-.165-.85-.495-1.11-.33-.26-.805-.39-1.426-.39Zm-2.536 8.16h-1.47l.03-.18V14.72l-.03-.18h1.47c.51 0 .896.05 1.155.15.26.1.44.25.545.45.105.2.157.42.157.66 0 .38-.14.69-.42.93-.28.24-.7.36-1.26.36Zm9.22-8.16c.42 0 .78.04 1.08.12.3.08.54.2.72.36.18.16.3.36.36.6.06.24.09.52.09.84v3.3c0 .42-.03.78-.09 1.08-.06.3-.18.54-.36.72-.18.18-.42.3-.72.36-.3.06-.66.09-1.08.09h-.66c-.42 0-.78-.03-1.08-.09-.3-.06-.54-.18-.72-.36-.18-.18-.3-.42-.36-.72-.06-.3-.09-.66-.09-1.08v-3.3c0-.32.03-.6.09-.84.06-.24.18-.44.36-.6.18-.16.42-.28.72-.36.3-.08.66-.12 1.08-.12h.66Zm-2.7 4.56v-1.62h.54c.24 0 .42.02.54.06.12.04.21.12.27.24.06.12.09.27.09.45v.18c0 .18-.03.33-.09.45-.06.12-.15.2-.27.24-.12.04-.3.06-.54.06h-.54Zm2.7.96v-.9h.48c.24 0 .42.02.54.06.12.04.21.12.27.24.06.12.09.27.09.45v.12c0 .18-.03.33-.09.45-.06.12-.15.2-.27.24-.12.04-.3.06-.54.06h-.48Z" />
    </svg>
  ),
  bkash: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  ),
  nagad: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  ),
  rocket: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
};

export interface PaymentMethodOption {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  enabled: boolean;
}

export function getPaymentMethods(enabledMethods: Record<string, boolean>): PaymentMethodOption[] {
  const all: PaymentMethodOption[] = [
    { id: "stripe", name: "Credit/Debit Card", icon: PAYMENT_ICONS.stripe, description: "Pay securely with Visa, Mastercard, Amex", enabled: enabledMethods.stripe },
    { id: "paypal", name: "PayPal", icon: PAYMENT_ICONS.paypal, description: "Pay with your PayPal account", enabled: enabledMethods.paypal },
    { id: "bkash", name: "bKash", icon: PAYMENT_ICONS.bkash, description: "Pay with your bKash mobile account", enabled: enabledMethods.bkash },
    { id: "nagad", name: "Nagad", icon: PAYMENT_ICONS.nagad, description: "Pay with your Nagad mobile account", enabled: enabledMethods.nagad },
    { id: "rocket", name: "Rocket", icon: PAYMENT_ICONS.rocket, description: "Pay with your Rocket mobile account", enabled: enabledMethods.rocket },
  ];
  return all;
}
