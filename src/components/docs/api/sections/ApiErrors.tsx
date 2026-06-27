import { Badge } from "@/components/ui/badge";

export function ApiErrors() {
  return (
    <div className="space-y-6">
      <h2>Error Handling</h2>
      <p>Our API uses standard HTTP status codes and returns error details in JSON format.</p>
      <h3>Error Response Format</h3>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
{`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  }
}`}
      </div>
      <h3>HTTP Status Codes</h3>
      <div className="space-y-2">
        {[
          { code: "200", color: "green", label: "Success" },
          { code: "400", color: "yellow", label: "Bad Request - Invalid input" },
          { code: "401", color: "red", label: "Unauthorized - Invalid or missing API key" },
          { code: "403", color: "red", label: "Forbidden - Insufficient permissions" },
          { code: "404", color: "red", label: "Not Found - Resource doesn't exist" },
          { code: "429", color: "red", label: "Too Many Requests - Rate limit exceeded" },
          { code: "500", color: "red", label: "Internal Server Error" },
        ].map(({ code, color, label }) => (
          <div key={code} className="flex items-center gap-4">
            <Badge className={`bg-${color}-100 text-${color}-700`}>{code}</Badge>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
