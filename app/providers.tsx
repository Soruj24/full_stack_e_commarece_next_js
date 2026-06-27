  
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { SettingsProvider } from '@/features/settings/context/SettingsContext';
import { CartProvider } from '@/features/cart/context/CartContext';
import { WishlistProvider } from '@/features/wishlist/hooks/WishlistContext';
import { RecentlyViewedProvider } from '@/features/common/hooks/RecentlyViewedContext';
import { CompareProvider } from '@/features/compare/context/CompareContext';
import { StockProvider } from '@/features/cart/context/StockContext';
import { GuestCheckoutProvider } from '@/features/checkout/context/GuestCheckoutContext';
import { OrderTrackingProvider } from '@/features/orders/context/OrderTrackingContext';
import { SaveForLaterProvider } from '@/features/cart/context/SaveForLaterContext';
import { BundleProvider } from '@/features/bundles/context/BundleContext';
import { SearchProvider } from '@/features/search/context/SearchContext';
import { PriceHistoryProvider } from '@/features/products/context/PriceHistoryContext';
import { QuickViewProvider } from '@/features/products/context/QuickViewContext';
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