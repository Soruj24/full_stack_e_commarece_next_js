"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowUp } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PolicySidebar } from "./PolicySidebar";
import { PolicyHeader } from "./PolicyHeader";
import { PolicyContentCards } from "./PolicyContentCards";

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
  icon,
  sections,
  lastUpdated,
}: PolicyLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const sectionsWithIds = useMemo(
    () =>
      (sections || []).map((s, i) => ({
        ...s,
        id: s.id || `section-${i}`,
      })),
    [sections]
  );

  const readingTime = useMemo(() => {
    const text = (sections || [])
      .map((s) => s.title + " " + (s.content?.toString() || ""))
      .join(" ");
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);

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

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <PolicySidebar
            sections={sectionsWithIds}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />

          <main className="lg:col-span-9 space-y-12">
            <PolicyHeader
              title={title}
              description={description}
              icon={icon}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              readingTime={readingTime}
              onPrint={() => window.print()}
            />

            <PolicyContentCards
              sections={filteredSections}
              activeSection={activeSection}
            />

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
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

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
