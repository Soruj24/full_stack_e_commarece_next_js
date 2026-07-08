  
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SettingsProvider } from "@/modules/settings/context/SettingsContext';
import { CartProvider } from "@/modules/cart/context/CartContext';
import { WishlistProvider } from "@/modules/wishlist/hooks/WishlistContext';
import { RecentlyViewedProvider } from "@/modules/common/hooks/RecentlyViewedContext';
import { CompareProvider } from "@/modules/compare/context/CompareContext';
import { StockProvider } from "@/modules/cart/context/StockContext';
import { GuestCheckoutProvider } from "@/modules/checkout/context/GuestCheckoutContext';
import { OrderTrackingProvider } from "@/modules/orders/context/OrderTrackingContext';
import { SaveForLaterProvider } from "@/modules/cart/context/SaveForLaterContext';
import { BundleProvider } from "@/modules/bundles/context/BundleContext';
import { SearchProvider } from "@/modules/search/context/SearchContext';
import { PriceHistoryProvider } from "@/modules/products/context/PriceHistoryContext';
import { QuickViewProvider } from "@/modules/products/context/QuickViewContext';
import NotificationWrapper from '@/components/common/NotificationWrapper';

export default function Providers({ children }: { children: ReactNode }) {
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