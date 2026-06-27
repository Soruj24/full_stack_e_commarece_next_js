import { Sparkles, Bug, ArrowUp, Shield, Clock } from "lucide-react";
import type { ComponentType } from "react";

export type ChangeType = "feature" | "bugfix" | "improvement" | "security" | "deprecation";

export interface Change {
  id: string;
  type: ChangeType;
  description: string;
  link?: string;
}

export interface Version {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: Change[];
  isNew?: boolean;
}

export const versions: Version[] = [
  {
    id: "v2-4-0", version: "2.4.0", date: "2024-01-20",
    title: "Major Performance Update",
    description: "Significant performance improvements and new dashboard features.",
    isNew: true,
    changes: [
      { id: "1", type: "improvement", description: "Reduced initial page load time by 40%" },
      { id: "2", type: "feature", description: "Added real-time analytics dashboard with live metrics" },
      { id: "3", type: "feature", description: "New dark mode with custom theme support" },
      { id: "4", type: "bugfix", description: "Fixed session timeout issues on mobile devices" },
      { id: "5", type: "improvement", description: "Enhanced search with fuzzy matching" },
    ],
  },
  {
    id: "v2-3-2", version: "2.3.2", date: "2024-01-15",
    title: "Security Patch",
    description: "Critical security updates and minor improvements.",
    changes: [
      { id: "6", type: "security", description: "Implemented rate limiting on API endpoints" },
      { id: "7", type: "security", description: "Added CSRF token validation" },
      { id: "8", type: "bugfix", description: "Fixed XSS vulnerability in comment section" },
      { id: "9", type: "improvement", description: "Updated password hashing to bcrypt with cost factor 12" },
    ],
  },
  {
    id: "v2-3-1", version: "2.3.1", date: "2024-01-10",
    title: "Bug Fixes",
    description: "Minor bug fixes and stability improvements.",
    changes: [
      { id: "10", type: "bugfix", description: "Fixed image upload failure for large files" },
      { id: "11", type: "bugfix", description: "Resolved cart synchronization issues" },
      { id: "12", type: "bugfix", description: "Fixed email notification delays" },
      { id: "13", type: "improvement", description: "Improved error messages for better debugging" },
    ],
  },
  {
    id: "v2-3-0", version: "2.3.0", date: "2024-01-05",
    title: "New Analytics Features",
    description: "Advanced analytics and reporting capabilities.",
    changes: [
      { id: "14", type: "feature", description: "Added customer lifetime value tracking" },
      { id: "15", type: "feature", description: "New revenue forecasting with ML predictions" },
      { id: "16", type: "feature", description: "Export reports to PDF and CSV" },
      { id: "17", type: "improvement", description: "Enhanced chart visualizations with animations" },
      { id: "18", type: "bugfix", description: "Fixed date range picker timezone issues" },
    ],
  },
  {
    id: "v2-2-0", version: "2.2.0", date: "2023-12-20",
    title: "Mobile App Integration",
    description: "New mobile app features and API improvements.",
    changes: [
      { id: "19", type: "feature", description: "Push notification support for order updates" },
      { id: "20", type: "feature", description: "QR code scanner for product lookup" },
      { id: "21", type: "improvement", description: "Optimized mobile checkout flow" },
      { id: "22", type: "bugfix", description: "Fixed touch gesture conflicts" },
      { id: "23", type: "deprecation", description: "Deprecated old mobile API v1 endpoints" },
    ],
  },
  {
    id: "v2-1-5", version: "2.1.5", date: "2023-12-15",
    title: "Performance & Security",
    description: "Core web vitals optimization and security enhancements.",
    changes: [
      { id: "24", type: "improvement", description: "Achieved 95+ Lighthouse score" },
      { id: "25", type: "improvement", description: "Implemented lazy loading for images" },
      { id: "26", type: "security", description: "Added two-factor authentication (2FA)" },
      { id: "27", type: "security", description: "Implemented OAuth 2.0 for social login" },
      { id: "28", type: "bugfix", description: "Fixed memory leak in WebSocket connections" },
    ],
  },
  {
    id: "v2-1-0", version: "2.1.0", date: "2023-12-01",
    title: "Marketplace Launch",
    description: "New marketplace features and seller tools.",
    changes: [
      { id: "29", type: "feature", description: "Multi-vendor marketplace support" },
      { id: "30", type: "feature", description: "Seller dashboard with analytics" },
      { id: "31", type: "feature", description: "Commission and payout management" },
      { id: "32", type: "improvement", description: "Enhanced product listing editor" },
      { id: "33", type: "bugfix", description: "Fixed inventory sync across sellers" },
    ],
  },
  {
    id: "v2-0-0", version: "2.0.0", date: "2023-11-15",
    title: "Major Platform Rewrite",
    description: "Complete platform modernization with Next.js 14 and new design system.",
    changes: [
      { id: "34", type: "feature", description: "Rebuilt with Next.js 14 App Router" },
      { id: "35", type: "feature", description: "New design system with shadcn/ui" },
      { id: "36", type: "feature", description: "Real-time notifications with WebSocket" },
      { id: "37", type: "improvement", description: "Migrated to TypeScript for type safety" },
      { id: "38", type: "improvement", description: "100% mobile responsive design" },
      { id: "39", type: "deprecation", description: "Removed legacy REST API (use GraphQL)" },
    ],
  },
  {
    id: "v1-9-0", version: "1.9.0", date: "2023-10-20",
    title: "Payment Gateway Expansion",
    description: "Support for additional payment methods and improved checkout.",
    changes: [
      { id: "40", type: "feature", description: "Added Stripe, PayPal, and Square support" },
      { id: "41", type: "feature", description: "Local payment methods (bKash, Nagad)" },
      { id: "42", type: "feature", description: "Subscription and recurring billing" },
      { id: "43", type: "improvement", description: "Streamlined checkout to 3 steps" },
    ],
  },
  {
    id: "v1-8-0", version: "1.8.0", date: "2023-09-15",
    title: "Inventory Management",
    description: "Advanced inventory tracking and management features.",
    changes: [
      { id: "44", type: "feature", description: "Real-time stock tracking" },
      { id: "45", type: "feature", description: "Low stock alerts and automation" },
      { id: "46", type: "feature", description: "Barcode and SKU management" },
      { id: "47", type: "improvement", description: "Batch product import/export" },
    ],
  },
];

export const changeTypeConfig: Record<ChangeType, { icon: ComponentType<{ className?: string }>; label: string; color: string; bgColor: string }> = {
  feature: { icon: Sparkles, label: "New Feature", color: "text-purple-600", bgColor: "bg-purple-100" },
  bugfix: { icon: Bug, label: "Bug Fix", color: "text-red-600", bgColor: "bg-red-100" },
  improvement: { icon: ArrowUp, label: "Improvement", color: "text-blue-600", bgColor: "bg-blue-100" },
  security: { icon: Shield, label: "Security", color: "text-green-600", bgColor: "bg-green-100" },
  deprecation: { icon: Clock, label: "Deprecated", color: "text-orange-600", bgColor: "bg-orange-100" },
};
