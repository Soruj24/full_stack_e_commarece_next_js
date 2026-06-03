export function ApiRateLimits() {
  return (
    <div className="space-y-6">
      <h2>Rate Limits</h2>
      <p>To ensure fair usage and platform stability, we implement rate limiting:</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { tier: "Free Tier", limit: "100", desc: "requests per minute" },
          { tier: "Pro Tier", limit: "1,000", desc: "requests per minute" },
          { tier: "Enterprise", limit: "10,000", desc: "requests per minute" },
        ].map(({ tier, limit, desc }) => (
          <div key={tier} className="bg-card rounded-lg border p-4">
            <h4 className="font-bold mb-2">{tier}</h4>
            <p className="text-2xl font-black text-primary">{limit}</p>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
      <h3>Rate Limit Headers</h3>
      <p>Every response includes these headers:</p>
      <ul>
        <li><code>X-RateLimit-Limit</code> - Your rate limit</li>
        <li><code>X-RateLimit-Remaining</code> - Requests remaining</li>
        <li><code>X-RateLimit-Reset</code> - Time until reset (Unix timestamp)</li>
      </ul>
    </div>
  );
}
