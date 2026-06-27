"use client";

import { useState, useMemo } from "react";
import { versions } from "@/lib/data/changelog";
import type { ChangeType } from "@/lib/data/changelog";

export function useChangelog() {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(versions[0]?.id ?? null);
  const [selectedType, setSelectedType] = useState<ChangeType | "all">("all");
  const [showAll, setShowAll] = useState(false);

  const filteredVersions = useMemo(() =>
    versions
      .map((v) => ({
        ...v,
        changes: selectedType === "all" ? v.changes : v.changes.filter((c) => c.type === selectedType),
      }))
      .filter((v) => v.changes.length > 0),
    [selectedType],
  );

  const displayedVersions = showAll ? filteredVersions : filteredVersions.slice(0, 5);

  const totalChanges = versions.reduce((acc, v) => acc + v.changes.length, 0);

  return {
    expandedVersion, setExpandedVersion,
    selectedType, setSelectedType,
    showAll, setShowAll,
    filteredVersions, displayedVersions,
    totalChanges,
  };
}
