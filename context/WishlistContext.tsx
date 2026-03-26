"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { IProduct } from "@/types";

interface WishlistContextType {
  wishlist: IProduct[];
  allIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
  fetchWishlist: (page?: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [allIds, setAllIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchWishlist = async (page = 1) => {
    if (!session) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/user/wishlist?page=${page}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setWishlist(data.wishlist);
        setAllIds(data.allIds || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setAllIds([]);
    }
  }, [session]);

  const toggleWishlist = async (productId: string) => {
    if (!session) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.action === "added") {
          toast.success("Added to wishlist");
        } else {
          toast.success("Removed from wishlist");
        }
        fetchWishlist(pagination.page); // Refresh current page
      } else {
        toast.error(data.error || "Failed to update wishlist");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const isInWishlist = (productId: string) => {
    return allIds.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      allIds, 
      isInWishlist, 
      toggleWishlist, 
      loading, 
      pagination,
      fetchWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
