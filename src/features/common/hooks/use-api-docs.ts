"use client";

import { useState, useCallback } from "react";

export function useApiDocs() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleEndpoint = useCallback((key: string) => {
    setExpandedEndpoint((prev) => (prev === key ? null : key));
  }, []);

  const copyToClipboard = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const selectSection = useCallback((id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
  }, []);

  return {
    activeSection, selectSection,
    expandedEndpoint, toggleEndpoint,
    sidebarOpen, setSidebarOpen,
    copiedCode, copyToClipboard,
  };
}
