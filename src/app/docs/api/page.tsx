"use client";

import { useApiDocs } from "@/modules/common/hooks/use-api-docs";
import { ApiHeader } from "@/components/docs/api/ApiHeader";
import { ApiSidebar } from "@/components/docs/api/ApiSidebar";
import { ApiIntroduction } from "@/components/docs/api/sections/ApiIntroduction";
import { ApiAuthentication } from "@/components/docs/api/sections/ApiAuthentication";
import { ApiRateLimits } from "@/components/docs/api/sections/ApiRateLimits";
import { ApiErrors } from "@/components/docs/api/sections/ApiErrors";
import { ApiWebhooks } from "@/components/docs/api/sections/ApiWebhooks";
import { ApiEndpointList } from "@/components/docs/api/sections/ApiEndpointList";

export default function ApiDocsPage() {
  const {
    activeSection, selectSection, expandedEndpoint, toggleEndpoint,
    sidebarOpen, setSidebarOpen, copiedCode, copyToClipboard,
  } = useApiDocs();

  const renderSection = () => {
    switch (activeSection) {
      case "introduction": return <ApiIntroduction />;
      case "authentication": return <ApiAuthentication />;
      case "rate-limits": return <ApiRateLimits />;
      case "errors": return <ApiErrors />;
      case "webhooks": return <ApiWebhooks />;
      default: return (
        <ApiEndpointList
          sectionId={activeSection}
          expandedEndpoint={expandedEndpoint}
          onToggleEndpoint={toggleEndpoint}
          copiedCode={copiedCode}
          onCopy={copyToClipboard}
        />
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ApiHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((p) => !p)} />
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <ApiSidebar activeSection={activeSection} onSelect={selectSection} open={sidebarOpen} />
          <main className="flex-1 p-6 lg:p-12 min-h-[calc(100vh-73px)]">
            <div className="max-w-4xl">{renderSection()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
