'use client';

import { createContext, useContext, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CartItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface AbandonedCartContextType {
  trackAbandonedCart: (items: CartItem[], total: number, email?: string) => Promise<void>;
  markRecovered: () => Promise<void>;
}

const AbandonedCartContext = createContext<AbandonedCartContextType | undefined>(undefined);

export function useAbandonedCart() {
  const context = useContext(AbandonedCartContext);
  if (!context) {
    throw new Error('useAbandonedCart must be used within AbandonedCartProvider');
  }
  return context;
}

interface AbandonedCartProviderProps {
  children: ReactNode;
}

export function AbandonedCartProvider({ children }: AbandonedCartProviderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const trackingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTrackedRef = useRef<string>('');

  const trackAbandonedCart = useCallback(async (items: CartItem[], total: number, email?: string) => {
    const cartKey = JSON.stringify({ items, total });
    
    if (cartKey === lastTrackedRef.current) return;
    lastTrackedRef.current = cartKey;

    if (items.length === 0) return;

    try {
      await fetch('/api/abandoned-carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: total,
          email: email || session?.user?.email,
          userId: session?.user?.id,
        }),
      });
    } catch (error) {
      console.error('Failed to track abandoned cart:', error);
    }
  }, [session]);

  const markRecovered = useCallback(async () => {
    if (!session?.user?.email) return;

    try {
      const res = await fetch('/api/abandoned-carts?status=active');
      const carts = await res.json();
      
      for (const cart of carts) {
        if (cart.email === session.user.email || cart.userId === session.user.id) {
          await fetch(`/api/abandoned-carts/${cart._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'recovered',
              recoveredAt: new Date(),
            }),
          });
        }
      }
    } catch (error) {
      console.error('Failed to mark cart recovered:', error);
    }
  }, [session]);

  useEffect(() => {
    return () => {
      if (trackingTimeoutRef.current) {
        clearTimeout(trackingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AbandonedCartContext.Provider value={{ trackAbandonedCart, markRecovered }}>
      {children}
    </AbandonedCartContext.Provider>
  );
}
