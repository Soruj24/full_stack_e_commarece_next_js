"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LucideIcon,
  Search,
  ArrowUp,
  Printer,
  Clock,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PolicySection {
  title: string;
  icon: LucideIcon;
  content: ReactNode;
  id?: string;
}

interface PolicyLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  sections: PolicySection[];
  lastUpdated: string;
}

export function PolicyLayout({
  title,
  description,
  icon: Icon,
  sections,
  lastUpdated,
}: PolicyLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Add IDs to sections for navigation if not provided
  const sectionsWithIds = useMemo(
    () =>
      (sections || []).map((s, i) => ({
        ...s,
        id: s.id || `section-${i}`,
      })),
    [sections]
  );

  // Calculate reading time
  const readingTime = useMemo(() => {
    const text = (sections || [])
      .map((s) => s.title + " " + (s.content?.toString() || ""))
      .join(" ");
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }, [sections]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Scroll to top button visibility
      setShowScrollTop(window.scrollY > 400);

      // Reading progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);

      // Active section tracking
      const sectionElements = sectionsWithIds.map((s) =>
        document.getElementById(s.id)
      );
      const currentSection = sectionElements.find((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= 200;
      });
      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionsWithIds]);

  const filteredSections = sectionsWithIds.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sidebar - Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">
                  Contents
                </h3>
                <nav className="space-y-1">
                  {sectionsWithIds.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <section.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{section.title}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform",
                          activeSection === section.id
                            ? "translate-x-0"
                            : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        )}
                      />
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <MessageCircle className="h-5 w-5" />
                  <h4 className="font-black text-sm uppercase tracking-wider">
                    Need Help?
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Have questions about our {title.toLowerCase()}? Our support
                  team is here to clarify any concerns.
                </p>
                <Button variant="outline" size="sm" className="w-full rounded-xl font-bold bg-background border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                  Contact Support
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-12">
            {/* Header */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                    <Icon className="h-3.5 w-3.5" />
                    Legal Document
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-none">
                    {title}
                  </h1>
                  <p className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrint}
                    className="rounded-2xl border-border hover:bg-muted transition-all"
                    aria-label="Print document"
                  >
                    <Printer className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-muted/50 border border-border text-sm font-bold text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background focus:ring-primary transition-all text-lg font-medium"
                />
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className={cn(
                      "group scroll-mt-24 p-8 md:p-10 rounded-[32px] border border-border bg-card transition-all duration-300",
                      activeSection === section.id
                        ? "shadow-2xl shadow-primary/5 border-primary/20 ring-1 ring-primary/10"
                        : "hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-6">
                      <div className={cn(
                        "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-primary/5 text-primary group-hover:bg-primary/10"
                      )}>
                        <section.icon className="h-7 w-7" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-primary/40 uppercase tracking-widest">
                            Section {index + 1}
                          </span>
                          <h2 className="text-2xl md:text-3xl font-black text-foreground">
                            {section.title}
                          </h2>
                        </div>
                        <div className="text-muted-foreground leading-relaxed font-medium text-lg prose prose-primary max-w-none">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </section>
                ))
              ) : (
                <div className="text-center py-20 bg-muted/20 rounded-[40px] border-2 border-dashed border-border">
                  <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-black text-foreground">No matches found</h3>
                  <p className="text-muted-foreground font-medium">Try adjusting your search query</p>
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-12 border-t border-border mt-12">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
                  Last Updated: {lastUpdated}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground">Share this:</span>
                <div className="flex gap-2">
                   {/* Share buttons could go here */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {showScrollTop && (
          <Button
            size="icon"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-14 w-14 rounded-2xl shadow-2xl shadow-primary/20 animate-in fade-in slide-in-from-bottom-4"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
