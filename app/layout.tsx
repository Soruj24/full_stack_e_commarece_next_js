import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import Providers from "./providers";
import { LocalizationProvider } from "@/context/LocalizationContext";
import { LiveChat } from "@/components/support/LiveChat";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransitionClient } from "@/components/layout/PageTransitionWrapper";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dbConnect } from "@/config/db";
import Settings from "@/models/Settings";
import { auth } from "@/auth";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NotificationLayout } from "@/components/common/NotificationLayout";
import { RecentlyViewedWidget } from "@/components/products/RecentlyViewedProducts";
import { CompareFloatingButton } from "@/components/products/CompareProducts";
import { SaveForLaterWidget } from "@/components/products/SaveForLater";
import { PWAProvider } from "@/components/pwa";
import { InstallPromptBanner } from "@/components/pwa";
import { OfflineIndicator } from "@/components/pwa";
import { FloatingContactWidget } from "@/components/common/FloatingContactWidget";
import { QuickViewProvider } from "@/context/QuickViewContext";

// Use a system font stack instead of downloading from Google Fonts to avoid connection issues
const fontSans = {
  className: "font-sans",
  variable: "--font-sans",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Shop | Premium Online Store",
    template: "%s | Shop"
  },
  description: "Discover premium products at Shop. Fast shipping, secure payments, 30-day returns, and exceptional customer service. Shop thousands of products today.",
  keywords: ["online shopping", "ecommerce", "premium products", "best deals", "shop online", "free shipping", "buy electronics", "buy fashion", "best prices"],
  authors: [{ name: "Shop" }],
  creator: "Shop",
  publisher: "Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Shop",
    title: "Shop | Premium Online Store",
    description: "Discover premium products at Shop. Fast shipping, secure payments, 30-day returns, and exceptional customer service.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shop - Premium Online Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Premium Online Store",
    description: "Discover premium products at Shop. Fast shipping, secure payments, 30-day returns, and exceptional customer service.",
    images: ["/og-image.jpg"],
    creator: "@shop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Shop",
  },
  applicationName: "Shop",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname");
  const acceptHeader = headerList.get("accept") || "";
  
  // If pathname is missing, it means proxy.ts didn't run (likely API or static)
  // We should skip maintenance check in this case to avoid loops or 404 issues
  let gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (pathname) {
    const isMaintenancePage = pathname === "/maintenance";
    const isAdminRoute = pathname.startsWith("/admin");
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/auth");
    const isApiRoute = pathname.startsWith("/api") || 
                      acceptHeader.includes("application/json") || 
                      pathname.startsWith("/_next") ||
                      pathname.includes("favicon.ico") ||
                      pathname.startsWith("/offline");

    if (!isMaintenancePage && !isAdminRoute && !isApiRoute && !isAuthRoute) {
      let shouldRedirect = false;
      try {
        const db = await dbConnect();
        if (db) {
          const settings = await Settings.findOne();
          
          if (settings?.googleAnalyticsId) {
            gaId = settings.googleAnalyticsId;
          }

          if (settings?.maintenanceMode) {
            const session = await auth();
            if (session?.user?.role !== "admin") {
              shouldRedirect = true;
            }
          }
        } else {
          console.warn("MongoDB not connected, skipping maintenance check");
        }
      } catch (error) {
        console.error("Maintenance check error:", error);
      }

      if (shouldRedirect) {
        redirect("/maintenance");
      }
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.className} antialiased`}>
        <Providers>
          <PWAProvider>
            <LocalizationProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <NotificationLayout>
                  <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary relative overflow-x-hidden">
                    <div className="fixed inset-0 pointer-events-none z-0">
                      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>

                    <Header />
                    <main className="flex-grow relative z-10">
                      <PageTransitionClient>{children}</PageTransitionClient>
                    </main>
                    <LiveChat />
                    <CookieConsent />
                    <ScrollToTop />
                    <ScrollProgressBar />
                    <Toaster richColors position="top-center" />
                    <RecentlyViewedWidget />
                    <CompareFloatingButton />
                    <SaveForLaterWidget />
                    <InstallPromptBanner />
                    <OfflineIndicator />
                    <FloatingContactWidget />
                  </div>
                </NotificationLayout>
              </ThemeProvider>
            </LocalizationProvider>
          </PWAProvider>
        </Providers>
        {gaId && (
          <GoogleAnalytics gaId={gaId} />
        )}
      </body>
    </html>
  );
}
