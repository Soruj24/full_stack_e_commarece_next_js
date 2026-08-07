"use client";

import { SessionProvider } from "next-auth/react";

import { ReactNode, useEffect } from "react";
import { SettingsProvider } from "@/modules/settings/context/SettingsContext";
import { CartProvider } from "@/modules/cart/context/CartContext";
import { WishlistProvider } from "@/modules/wishlist/hooks/WishlistContext";
import { RecentlyViewedProvider } from "@/modules/common/hooks/RecentlyViewedContext";
import { CompareProvider } from "@/modules/compare/context/CompareContext";
import { StockProvider } from "@/modules/cart/context/StockContext";
import { GuestCheckoutProvider } from "@/modules/checkout/context/GuestCheckoutContext";
import { OrderTrackingProvider } from "@/modules/orders/context/OrderTrackingContext";
import { SaveForLaterProvider } from "@/modules/cart/context/SaveForLaterContext";
import { BundleProvider } from "@/modules/bundles/context/BundleContext";
import { SearchProvider } from "@/modules/search/context/SearchContext";
import { PriceHistoryProvider } from "@/modules/products/context/PriceHistoryContext";
import { QuickViewProvider } from "@/modules/products/context/QuickViewContext";
import NotificationWrapper from "@/components/common/NotificationWrapper";

const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";

function installGlobalCsrfFetch() {
  if (typeof window === "undefined") return;
  const originalFetch = window.fetch;
  window.fetch = (input, init) => {
    const method = (init?.method || "GET").toUpperCase();
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return originalFetch(input, init);
    }
    const token = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`));
    if (!token) return originalFetch(input, init);
    const headers = new Headers(init?.headers);
    headers.set(CSRF_HEADER, decodeURIComponent(token[1]));
    return originalFetch(input, { ...init, headers });
  };
}

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => { installGlobalCsrfFetch(); }, []);

  return (
    <SessionProvider>
      <SettingsProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <CompareProvider>
                <StockProvider>
                  <GuestCheckoutProvider>
                    <OrderTrackingProvider>
                      <SaveForLaterProvider>
                        <BundleProvider>
                          <SearchProvider>
                            <PriceHistoryProvider>
                              <NotificationWrapper>
                              <QuickViewProvider>
                                {children}
                              </QuickViewProvider>
                            </NotificationWrapper>
                            </PriceHistoryProvider>
                          </SearchProvider>
                        </BundleProvider>
                      </SaveForLaterProvider>
                    </OrderTrackingProvider>
                  </GuestCheckoutProvider>
                </StockProvider>
              </CompareProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}