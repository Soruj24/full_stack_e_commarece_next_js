"use client";

import { ChevronDown, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Endpoint, methodColors } from "@/lib/data/api-docs";

interface Props {
  endpoint: Endpoint;
  isExpanded: boolean;
  onToggle: () => void;
  copiedCode: string | null;
  onCopy: (code: string) => void;
}

export function ApiEndpointCard({ endpoint, isExpanded, onToggle, copiedCode, onCopy }: Props) {
  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors">
        <Badge className={cn("font-mono font-bold shrink-0", methodColors[endpoint.method])}>{endpoint.method}</Badge>
        <code className="text-sm font-mono flex-1 truncate">{endpoint.path}</code>
        <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.description}</span>
        {endpoint.auth && <Badge variant="outline" className="shrink-0">Auth</Badge>}
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground shrink-0 transition-transform", isExpanded && "rotate-180")} />
      </button>

      {isExpanded && (
        <div className="border-t border-border/50 p-4 space-y-4">
          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
          {endpoint.params && endpoint.params.length > 0 && (
            <div>
              <h4 className="font-bold mb-2">Query Parameters</h4>
              <div className="space-y-2">
                {endpoint.params.map((param, i) => (
                  <div key={i} className="flex items-start gap-4 text-sm">
                    <code className="bg-muted px-2 py-1 rounded font-mono shrink-0">{param.name}</code>
                    <span className="text-muted-foreground">{param.description}</span>
                    <Badge variant="outline" className="shrink-0">{param.type}</Badge>
                    {param.required && <Badge className="bg-red-100 text-red-700 shrink-0">Required</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {endpoint.body && endpoint.body.length > 0 && (
            <div>
              <h4 className="font-bold mb-2">Request Body</h4>
              <div className="space-y-2">
                {endpoint.body.map((param, i) => (
                  <div key={i} className="flex items-start gap-4 text-sm">
                    <code className="bg-muted px-2 py-1 rounded font-mono shrink-0">{param.name}</code>
                    <span className="text-muted-foreground">{param.description}</span>
                    <Badge variant="outline" className="shrink-0">{param.type}</Badge>
                    {param.required && <Badge className="bg-red-100 text-red-700 shrink-0">Required</Badge>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {endpoint.response && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">Response</h4>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => onCopy(endpoint.response!)}>
                  {copiedCode === endpoint.response ? (
                    <><CheckCircle2 className="w-4 h-4 text-green-500" /> Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copy</>
                  )}
                </Button>
              </div>
              <pre className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">{endpoint.response}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
