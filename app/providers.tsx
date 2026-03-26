  
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { RecentlyViewedProvider } from '@/context/RecentlyViewedContext';
import { CompareProvider } from '@/context/CompareContext';
import { StockProvider } from '@/context/StockContext';
import { GuestCheckoutProvider } from '@/context/GuestCheckoutContext';
import { OrderTrackingProvider } from '@/context/OrderTrackingContext';
import { SaveForLaterProvider } from '@/context/SaveForLaterContext';
import { BundleProvider } from '@/context/BundleContext';
import { SearchProvider } from '@/context/SearchContext';
import { PriceHistoryProvider } from '@/context/PriceHistoryContext';
import { QuickViewProvider } from '@/context/QuickViewContext';
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