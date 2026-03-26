"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LogOut, 
  Menu, 
  X, 
  Home, 
  User as UserIcon, 
  Bell, 
  Mail, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  LayoutDashboard, 
  ShoppingCart, 
  ChevronDown, 
  Wifi, 
  WifiOff,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Shirt,
  ShoppingBag,
  Star,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Heart } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { ICategory } from "@/types";
import { ProductSearch } from "@/components/products/ProductSearch";
import { useMounted } from "@/hooks/use-mounted";
import { useNotifications } from "@/context/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { CategoriesDropdown } from "./CategoriesDropdown";
import { CartDrawer } from "./CartDrawer";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { settings } = useSettings();
  const { notifications: contextNotifications, unreadCount, markAsRead: markAsReadContext, markAllAsRead: markAllAsReadContext, isConnected } = useNotifications();
  const user = session?.user;
  const loading = status === "loading";
  const mounted = useMounted();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart() || { totalItems: 0 };

  // Fetch categories for mega menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?active=true&sortBy=order");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryIcon = (iconName?: string) => {
    const icons: Record<string, React.ReactNode> = {
      laptop: <Laptop className="h-4 w-4 sm:h-5 sm:w-5" />,
      phones: <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />,
      watches: <Watch className="h-4 w-4 sm:h-5 sm:w-5" />,
      headphones: <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />,
      camera: <Camera className="h-4 w-4 sm:h-5 sm:w-5" />,
      gamepad: <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      shirt: <Shirt className="h-4 w-4 sm:h-5 sm:w-5" />,
      default: <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />,
    };
    return iconName ? icons[iconName] || icons.default : icons.default;
  };

  const getCategoryGradient = (iconName?: string) => {
    const gradients: Record<string, string> = {
      laptop: "from-blue-500 to-cyan-500",
      phones: "from-purple-500 to-pink-500",
      watches: "from-orange-500 to-red-500",
      headphones: "from-green-500 to-emerald-500",
      camera: "from-yellow-500 to-orange-500",
      gamepad: "from-indigo-500 to-violet-500",
      shirt: "from-pink-500 to-rose-500",
      default: "from-primary to-purple-500",
    };
    return iconName ? gradients[iconName] || gradients.default : gradients.default;
  };

  const markAsRead = async (id: string, link?: string) => {
    await markAsReadContext(id);
    if (link) {
      router.push(link);
    }
  };

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });

      setMobileMenuOpen(false);

      // Redirect to home
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      // Fallback
      window.location.href = "/";
    }
  };

  // Navigation items for all users
  const publicNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  // Navigation items for authenticated users
  const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: UserIcon },
    { name: "Admin", href: "/admin/dashboard", icon: LayoutDashboard },
  ];

  // Filter admin link based on role
  const isAdmin = user?.role === "admin" || user?.role === "ADMIN";
  const displayedUserNavigation = userNavigation.filter(
    (item) => item.name !== "Admin" || isAdmin,
  );

  // Loading skeleton or not mounted (hydration safety)
  if (loading || !mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-xl bg-primary/10 animate-pulse" />
              <div className="ml-2 h-6 w-24 bg-muted rounded-lg animate-pulse" />
            </div>

            {/* Desktop nav skeleton */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded-full animate-pulse" />
            </div>

            {/* Mobile menu button skeleton */}
            <div className="flex md:hidden items-center space-x-2">
              <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
              <div className="h-9 w-9 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm py-1"
          : "bg-gradient-to-b from-primary/5 via-transparent to-transparent border-b border-transparent py-3",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 sm:gap-12">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-4 group relative"
            >
              <div className="relative h-9 w-9 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 overflow-hidden">
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt={settings.siteName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShieldCheck className="text-primary-foreground h-4 w-4 sm:h-7 sm:w-7" />
                )}
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-2xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                  {settings?.siteName
                    ? settings.siteName.split(" ")[0]
                    : "Nexus"}
                </span>
                <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-primary leading-none mt-0.5 sm:mt-1">
                  {settings?.siteName
                    ? settings.siteName.split(" ").slice(1).join(" ")
                    : "Identity"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <Link
                href="/"
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group py-2",
                  pathname === "/" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative z-10">Home</span>
                <motion.span
                  className={cn(
                    "absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full",
                    pathname === "/" ? "w-full" : "w-0",
                  )}
                  layoutId={pathname === "/" ? "activeNav" : undefined}
                />
              </Link>
              
              <div className="relative">
                <button
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group py-2 flex items-center gap-1",
                    megaMenuOpen || pathname.startsWith("/products") || pathname.startsWith("/categories") ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="relative z-10">Shop</span>
                  <ChevronDown className={cn("w-3 h-3 transition-transform", megaMenuOpen && "rotate-180")} />
                  <motion.span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full",
                      megaMenuOpen || pathname.startsWith("/products") || pathname.startsWith("/categories") ? "w-full" : "w-0",
                    )}
                  />
                </button>
                
                {megaMenuOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-50">
                    <CategoriesDropdown isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
                  </div>
                )}
              </div>
              
              <Link
                href="/about"
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group py-2",
                  pathname === "/about" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative z-10">About Us</span>
                <motion.span
                  className={cn(
                    "absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full",
                    pathname === "/about" ? "w-full" : "w-0",
                  )}
                  layoutId={pathname === "/about" ? "activeNav" : undefined}
                />
              </Link>
              
              <Link
                href="/contact"
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-primary relative group py-2",
                  pathname === "/contact" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative z-10">Contact</span>
                <motion.span
                  className={cn(
                    "absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full",
                    pathname === "/contact" ? "w-full" : "w-0",
                  )}
                  layoutId={pathname === "/contact" ? "activeNav" : undefined}
                />
              </Link>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Search - Desktop Command Palette */}
            <div className="hidden xl:block w-72">
              <ProductSearch />
            </div>

            <div className="flex items-center bg-muted/30 p-1 rounded-full border border-border/40">
              <ModeToggle />

              <div className="h-4 w-[1px] bg-border/60 mx-1 hidden md:block" />

              <Link href="/wishlist" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartDrawerOpen(true)}
                className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-all h-8 w-8 sm:h-10 sm:w-10"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-[8px] sm:text-[10px] font-black text-primary-foreground flex items-center justify-center ring-2 sm:ring-4 ring-background shadow-lg">
                  {totalItems}
                </span>
              </Button>
            </div>

            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-all bg-muted/30 md:bg-transparent h-9 w-9 sm:h-10 sm:w-10"
                    >
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-primary text-[7px] sm:text-[8px] font-black text-primary-foreground flex items-center justify-center ring-2 ring-background">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[calc(100vw-32px)] sm:w-80 p-0 rounded-[24px] shadow-2xl border-border/40 overflow-hidden mt-2"
                  >
                    <div className="p-5 border-b border-border/40 bg-muted/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                          Notifications
                        </h3>
                        {isConnected ? (
                          <Wifi className="w-3 h-3 text-green-500" />
                        ) : (
                          <WifiOff className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsReadContext}
                          className="text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-7 px-3 rounded-full"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[380px] overflow-y-auto">
                      {contextNotifications.length > 0 ? (
                        contextNotifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => markAsRead(n._id, n.link)}
                            className={cn(
                              "p-5 border-b border-border/40 last:border-0 cursor-pointer transition-all hover:bg-primary/[0.02]",
                              !n.isRead ? "bg-primary/[0.03]" : "opacity-70",
                            )}
                          >
                            <div className="flex gap-4">
                              <div
                                className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                  n.type === "success"
                                    ? "bg-green-500/10 text-green-500"
                                    : n.type === "warning"
                                      ? "bg-amber-500/10 text-amber-500"
                                      : n.type === "error"
                                        ? "bg-red-500/10 text-red-500"
                                        : "bg-primary/10 text-primary",
                                )}
                              >
                                <Bell className="h-4 w-4" />
                              </div>
                              <div className="space-y-1">
                                <p
                                  className={cn(
                                    "text-xs leading-tight",
                                    !n.isRead
                                      ? "font-black text-foreground"
                                      : "font-medium text-muted-foreground",
                                  )}
                                >
                                  {n.title || "Notification"}
                                </p>
                                <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
                                  {n.message}
                                </p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-2">
                                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                            <Bell className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
                            All caught up
                          </p>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="pl-1 sm:pl-1.5 pr-2 sm:pr-4 py-1 sm:py-1.5 h-10 sm:h-12 rounded-full hover:bg-muted/50 transition-all border border-transparent hover:border-border/40"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-background shadow-md">
                            <AvatarImage src={user?.image || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-[8px] sm:text-[10px] font-black">
                              {user?.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full ring-2 ring-background shadow-sm" />
                        </div>
                        <div className="flex flex-col items-start text-left hidden lg:flex">
                          <span className="text-xs font-black text-foreground leading-none uppercase tracking-tight">
                            {user?.name}
                          </span>
                          <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] mt-1 opacity-80">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 rounded-[28px] shadow-2xl border-border/40 bg-popover/95 backdrop-blur-xl mt-2"
                  >
                    <div className="px-4 py-4 mb-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Signed in as
                      </p>
                      <p className="text-sm font-black text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-[10px] font-medium text-muted-foreground/70 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="h-[1px] bg-border/40 mx-2 mb-2" />
                    <div className="space-y-1">
                      {displayedUserNavigation.map((item) => (
                        <DropdownMenuItem
                          key={item.name}
                          asChild
                          className="rounded-2xl focus:bg-primary/5 focus:text-primary cursor-pointer px-4 py-2.5 transition-colors group"
                        >
                          <Link href={item.href} className="flex items-center">
                            <item.icon className="mr-3 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[11px] font-black uppercase tracking-widest">
                              {item.name}
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                    <div className="h-[1px] bg-border/40 mx-2 my-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-2xl text-red-500 focus:bg-red-500/5 focus:text-red-600 cursor-pointer px-4 py-2.5 transition-colors group"
                    >
                      <LogOut className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[11px] font-black uppercase tracking-widest">
                        Logout
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="rounded-full px-4 sm:px-6 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 hidden xs:flex"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full px-3 sm:px-6 h-8 sm:h-11 text-[9px] sm:text-[11px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95"
                >
                  <Link href="/register">Join Nexus</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-xl sm:rounded-2xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all h-9 w-9 sm:h-11 sm:w-11"
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[450px] p-0 border-l-0 bg-background/95 backdrop-blur-2xl"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                  <SheetDescription>
                    Access platform features and account settings
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col h-full relative overflow-hidden">
                  {/* Decorative Background for Sheet */}
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                  <div className="p-6 sm:p-8 border-b border-border/40 flex items-center justify-between relative z-10 bg-background/50 backdrop-blur-md">
                    <div className="flex items-center gap-4 group">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
                        <ShieldCheck className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-black tracking-tighter italic">
                          NEXUS
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">
                          Identity Core
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-all h-10 w-10 sm:h-12 sm:w-12"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 relative z-10">
                    {/* Search in Mobile */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative z-[50]"
                    >
                      <ProductSearch />
                    </motion.div>

                    {/* Main Links */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-5 px-2">
                        System Access
                      </p>
                      <div className="space-y-2">
                        {publicNavigation.map((item, idx) => {
                          const isActive = pathname === item.href;
                          return (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + idx * 0.05 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-[22px] transition-all group relative overflow-hidden",
                                  isActive
                                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                                    : "hover:bg-muted/50 border border-transparent hover:border-border/40",
                                )}
                              >
                                <div className="flex items-center gap-4 relative z-10">
                                  <div
                                    className={cn(
                                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                      isActive
                                        ? "bg-white/20"
                                        : "bg-primary/5 text-primary group-hover:bg-primary/10",
                                    )}
                                  >
                                    <item.icon className="h-5 w-5" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">
                                    {item.name}
                                  </span>
                                </div>
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 -rotate-90 transition-opacity relative z-10",
                                    isActive
                                      ? "opacity-100"
                                      : "opacity-20 group-hover:opacity-100",
                                  )}
                                />
                                {!isActive && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.02] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                          Browse Categories
                        </p>
                        <Link
                          href="/categories"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {(categories || []).slice(0, 8).map((cat, idx) => (
                          <motion.div
                            key={cat._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + idx * 0.05 }}
                          >
                            <Link
                              href={`/products?category=${cat.slug}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex flex-col gap-3 p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 hover:from-primary/5 hover:to-primary/10 border border-transparent hover:border-primary/20 transition-all duration-300 group"
                            >
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getCategoryGradient(cat.icon)} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                <div className="text-white">
                                  {getCategoryIcon(cat.icon)}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-tight block">
                                  {cat.name}
                                </span>
                                {cat.description && (
                                  <span className="text-[9px] text-muted-foreground line-clamp-2 leading-relaxed hidden sm:block">
                                    {cat.description}
                                  </span>
                                )}
                              </div>
                              {cat.isFeatured && (
                                <div className="absolute top-2 right-2">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                </div>
                              )}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Account Links */}
                    {user && (
                      <div className="space-y-3">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-5 px-2">
                          Authorized Ops
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {displayedUserNavigation.map((item, idx) => (
                            <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + idx * 0.05 }}
                            >
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all group"
                              >
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                  <item.icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs sm:text-sm font-black uppercase tracking-widest italic">
                                  {item.name}
                                </span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Footer */}
                  <div className="p-6 sm:p-8 bg-muted/30 border-t border-border/40 relative z-10 backdrop-blur-md">
                    {user ? (
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 px-2">
                          <div className="relative">
                            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-background shadow-lg">
                              <AvatarImage src={user?.image || ""} />
                              <AvatarFallback className="bg-primary text-white text-[12px] font-black">
                                {user?.name?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-4 ring-background shadow-sm" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-tight italic">
                              {user?.name}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                              {user?.role}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-full justify-start gap-4 h-16 sm:h-20 px-6 rounded-2xl sm:rounded-[28px] text-red-500 hover:text-red-600 hover:bg-red-500/5 font-black uppercase tracking-widest text-[11px] sm:text-[12px] border border-transparent hover:border-red-500/20 transition-all"
                        >
                          <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <LogOut className="h-5 w-5" />
                          </div>
                          Terminate Session
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          asChild
                          variant="outline"
                          className="h-16 sm:h-20 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest text-[10px] sm:text-[11px] border-border/60 hover:bg-muted hover:border-foreground/20 transition-all italic"
                        >
                          <Link href="/login">Initialize</Link>
                        </Button>
                        <Button
                          asChild
                          className="h-16 sm:h-20 rounded-2xl sm:rounded-[28px] font-black uppercase tracking-widest text-[10px] sm:text-[11px] bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all italic"
                        >
                          <Link href="/register">Join Nexus</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </nav>
  );
};

export default Navbar;
