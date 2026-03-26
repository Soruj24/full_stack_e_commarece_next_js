"use client";

import { useState } from "react";
import { 
  Tag, 
  Plus, 
  Bug, 
  Sparkles, 
  Rocket, 
  Shield, 
  Clock,
  ChevronDown,
  ExternalLink,
  Github,
  Twitter,
  CheckCircle2,
  ArrowUp,
  Zap,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ChangeType = "feature" | "bugfix" | "improvement" | "security" | "deprecation";

interface Change {
  id: string;
  type: ChangeType;
  description: string;
  link?: string;
}

interface Version {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  changes: Change[];
  isNew?: boolean;
}

const versions: Version[] = [
  {
    id: "v2-4-0",
    version: "2.4.0",
    date: "2024-01-20",
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
    id: "v2-3-2",
    version: "2.3.2",
    date: "2024-01-15",
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
    id: "v2-3-1",
    version: "2.3.1",
    date: "2024-01-10",
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
    id: "v2-3-0",
    version: "2.3.0",
    date: "2024-01-05",
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
    id: "v2-2-0",
    version: "2.2.0",
    date: "2023-12-20",
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
    id: "v2-1-5",
    version: "2.1.5",
    date: "2023-12-15",
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
    id: "v2-1-0",
    version: "2.1.0",
    date: "2023-12-01",
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
    id: "v2-0-0",
    version: "2.0.0",
    date: "2023-11-15",
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
    id: "v1-9-0",
    version: "1.9.0",
    date: "2023-10-20",
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
    id: "v1-8-0",
    version: "1.8.0",
    date: "2023-09-15",
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

const changeTypeConfig: Record<ChangeType, { icon: typeof Sparkles; label: string; color: string; bgColor: string }> = {
  feature: { icon: Sparkles, label: "New Feature", color: "text-purple-600", bgColor: "bg-purple-100" },
  bugfix: { icon: Bug, label: "Bug Fix", color: "text-red-600", bgColor: "bg-red-100" },
  improvement: { icon: ArrowUp, label: "Improvement", color: "text-blue-600", bgColor: "bg-blue-100" },
  security: { icon: Shield, label: "Security", color: "text-green-600", bgColor: "bg-green-100" },
  deprecation: { icon: Clock, label: "Deprecated", color: "text-orange-600", bgColor: "bg-orange-100" },
};

export default function ChangelogPage() {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(versions[0]?.id || null);
  const [selectedType, setSelectedType] = useState<ChangeType | "all">("all");
  const [showAll, setShowAll] = useState(false);

  const filteredVersions = versions.map((version) => ({
    ...version,
    changes: selectedType === "all" 
      ? version.changes 
      : version.changes.filter((c) => c.type === selectedType),
  })).filter((v) => v.changes.length > 0);

  const displayedVersions = showAll ? filteredVersions : filteredVersions.slice(0, 5);

  const totalChanges = versions.reduce((acc, v) => acc + v.changes.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-card/50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Changelog
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            Product <span className="text-primary">Updates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with our latest features, improvements, and bug fixes.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-black text-primary">{versions.length}</div>
              <div className="text-sm text-muted-foreground">Releases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-primary">{totalChanges}</div>
              <div className="text-sm text-muted-foreground">Changes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-600">{versions[0]?.version}</div>
              <div className="text-sm text-muted-foreground">Latest</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType("all")}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  selectedType === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                All
              </button>
              {(Object.keys(changeTypeConfig) as ChangeType[]).map((type) => {
                const config = changeTypeConfig[type];
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                      selectedType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <config.icon className="w-3.5 h-3.5" />
                    {config.label}
                  </button>
                );
              })}
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Changelog Timeline */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

            {/* Version Entries */}
            <div className="space-y-8">
              {displayedVersions.map((version, index) => {
                const isExpanded = expandedVersion === version.id;
                const isLeft = index % 2 === 0;

                return (
                  <div key={version.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={cn(
                      "absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background z-10",
                      version.isNew ? "bg-primary" : "bg-muted-foreground"
                    )} />

                    {/* Card */}
                    <div className={cn(
                      "ml-14 md:ml-0 md:w-[calc(50%-2rem)]",
                      isLeft ? "md:mr-auto" : "md:ml-auto"
                    )}>
                      <button
                        onClick={() => setExpandedVersion(isExpanded ? null : version.id)}
                        className={cn(
                          "w-full bg-card rounded-2xl border border-border/50 p-6 text-left transition-all hover:shadow-lg",
                          isExpanded && "ring-2 ring-primary/20"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono font-bold">
                                v{version.version}
                              </Badge>
                              {version.isNew && (
                                <Badge className="bg-primary text-primary-foreground">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Latest
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-lg font-bold">{version.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(version.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <ChevronDown className={cn(
                              "w-5 h-5 text-muted-foreground transition-transform",
                              isExpanded && "rotate-180"
                            )} />
                          </div>
                        </div>
                        <p className="text-muted-foreground">{version.description}</p>
                      </button>

                      {/* Expanded Changes */}
                      {isExpanded && (
                        <div className="mt-4 ml-4 space-y-3">
                          {version.changes.map((change) => {
                            const config = changeTypeConfig[change.type];
                            const Icon = config.icon;
                            return (
                              <div
                                key={change.id}
                                className="flex items-start gap-3 bg-card rounded-xl border border-border/50 p-4"
                              >
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.bgColor)}>
                                  <Icon className={cn("w-4 h-4", config.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm">{change.description}</p>
                                  {change.link && (
                                    <a
                                      href={change.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                                    >
                                      Learn more <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Button */}
            {filteredVersions.length > 5 && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : `Show All ${filteredVersions.length} Releases`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Get notified about new releases and important updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-xl border border-input bg-background"
            />
            <Button className="h-12 rounded-xl px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Want to suggest a feature?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
