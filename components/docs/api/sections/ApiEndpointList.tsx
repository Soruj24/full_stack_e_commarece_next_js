"use client";

import { endpoints } from "@/lib/data/api-docs";
import { ApiEndpointCard } from "../ApiEndpointCard";

interface Props {
  sectionId: string;
  expandedEndpoint: string | null;
  onToggleEndpoint: (key: string) => void;
  copiedCode: string | null;
  onCopy: (code: string) => void;
}

export function ApiEndpointList({ sectionId, expandedEndpoint, onToggleEndpoint, copiedCode, onCopy }: Props) {
  const sectionEndpoints = endpoints[sectionId];
  if (!sectionEndpoints) return null;

  return (
    <div className="space-y-6">
      <h2>{sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} API</h2>
      {sectionEndpoints.map((endpoint, idx) => {
        const key = `${endpoint.method}-${endpoint.path}`;
        return (
          <ApiEndpointCard
            key={idx}
            endpoint={endpoint}
            isExpanded={expandedEndpoint === key}
            onToggle={() => onToggleEndpoint(key)}
            copiedCode={copiedCode}
            onCopy={onCopy}
          />
        );
      })}
    </div>
  );
}
