"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMounted } from "@/features/common/hooks/use-mounted";
import { ICategory } from '@/lib/types';
import { fetchActiveCategories } from "@/features/categories/services/category-service";

export function useNavbar() {
  const { data: session, status } = useSession();
  const mounted = useMounted();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const loading = status === "loading";

  useEffect(() => {
    fetchActiveCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      window.location.href = "/";
    }
  };

  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";

  return {
    user,
    loading,
    mounted,
    isScrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    megaMenuOpen,
    setMegaMenuOpen,
    cartDrawerOpen,
    setCartDrawerOpen,
    categories,
    pathname,
    handleLogout,
    isAdmin,
  };
}
