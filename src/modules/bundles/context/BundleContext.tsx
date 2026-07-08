"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface BundleProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  stock?: number;
}

export interface Bundle {
  _id: string;
  name: string;
  description: string;
  products: BundleProduct[];
  originalPrice: number;
  bundlePrice: number;
  discount: number;
  discountPercentage: number;
  stock: number;
  images?: string[];
  category?: { name: string; slug: string };
  brand?: string;
  isActive: boolean;
  validUntil?: string;
  maxQuantity?: number;
}

interface BundleContextType {
  bundles: Bundle[];
  loading: boolean;
  selectedBundle: Bundle | null;
  fetchBundles: () => Promise<void>;
  getBundle: (id: string) => Promise<Bundle | null>;
  addBundleToCart: (bundle: Bundle, quantity?: number) => void;
  isBundleInCart: (bundleId: string) => boolean;
}

const BundleContext = createContext<BundleContextType | undefined>(undefined);

const MAX_BUNDLES_TO_STORE = 50;

export function BundleProvider({ children }: { children: ReactNode }) {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  const fetchBundles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bundles");
      const data = await res.json();
      if (data.success && data.bundles) {
        const activeBundles = data.bundles.filter(
          (b: Bundle) =>
            b.isActive &&
            (b.stock > 0 || b.stock === undefined) &&
            (!b.validUntil || new Date(b.validUntil) > new Date())
        );
        setBundles(activeBundles.slice(0, MAX_BUNDLES_TO_STORE));
      }
    } catch (error) {
      console.error("Failed to fetch bundles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBundle = useCallback(async (id: string): Promise<Bundle | null> => {
    try {
      const res = await fetch(`/api/bundles/${id}`);
      const data = await res.json();
      if (data.success && data.bundle) {
        setSelectedBundle(data.bundle);
        return data.bundle;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch bundle:", error);
      return null;
    }
  }, []);

  const addBundleToCart = useCallback((bundle: Bundle, quantity: number = 1) => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    
    const bundleCartItem = {
      id: `bundle-${bundle._id}`,
      name: bundle.name,
      price: bundle.bundlePrice,
      image: bundle.products[0]?.image || "/placeholder.svg",
      quantity,
      isBundle: true,
      bundleProducts: bundle.products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
      })),
    };

    const existingIndex = cartItems.findIndex(
      (item: { id: string }) => item.id === bundleCartItem.id
    );

    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push(bundleCartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  const isBundleInCart = useCallback((bundleId: string): boolean => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    return cartItems.some((item: { id: string }) => item.id === `bundle-${bundleId}`);
  }, []);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  return (
    <BundleContext.Provider
      value={{
        bundles,
        loading,
        selectedBundle,
        fetchBundles,
        getBundle,
        addBundleToCart,
        isBundleInCart,
      }}
    >
      {children}
    </BundleContext.Provider>
  );
}

export function useBundle() {
  const context = useContext(BundleContext);
  if (context === undefined) {
    throw new Error("useBundle must be used within a BundleProvider");
  }
  return context;
}
