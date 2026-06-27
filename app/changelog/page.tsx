"use client";

import { useChangelog } from "@/features/common/hooks/use-changelog";
import { ChangelogHeader } from "@/components/changelog/ChangelogHeader";
import { ChangelogFilterBar } from "@/components/changelog/ChangelogFilterBar";
import { ChangelogTimeline } from "@/components/changelog/ChangelogTimeline";
import { ChangelogSubscribe } from "@/components/changelog/ChangelogSubscribe";
import { ChangelogFooter } from "@/components/changelog/ChangelogFooter";

export default function ChangelogPage() {
  const {
    expandedVersion, setExpandedVersion,
    selectedType, setSelectedType,
    showAll, setShowAll,
    displayedVersions, filteredVersions,
    totalChanges,
  } = useChangelog();

  return (
    <div className="min-h-screen bg-background">
      <ChangelogHeader totalChanges={totalChanges} />
      <ChangelogFilterBar selectedType={selectedType} onTypeChange={setSelectedType} />
      <ChangelogTimeline
        versions={displayedVersions}
        expandedVersion={expandedVersion}
        onToggleExpand={setExpandedVersion}
        filteredLength={filteredVersions.length}
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
      />
      <ChangelogSubscribe />
      <ChangelogFooter />
    </div>
  );
}
