"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMounted } from "@/modules/common/hooks/use-mounted";
import { ICategory } from "@/shared/types";
import { fetchActiveCategories } from "@/modules/categories/services/category-service";

export function useNavbar() {
  const { data: session, status } = useSession();
  const mounted = useMounted();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [commandSearchOpen, setCommandSearchOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const loading = status === "loading";

  useEffect(() => {
    fetchActiveCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      // Cmd+K / Ctrl+K — open command search
      if (isMod && e.key === "k") {
        e.preventDefault();
        setCommandSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
    mobileSearchOpen,
    setMobileSearchOpen,
    commandSearchOpen,
    setCommandSearchOpen,
    categories,
    pathname,
    handleLogout,
    isAdmin,
  };
}
