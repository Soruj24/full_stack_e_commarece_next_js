export function ApiAuthentication() {
  return (
    <div className="space-y-6">
      <h2>Authentication</h2>
      <p>Our API uses Bearer token authentication. Include your API key in the Authorization header of every request.</p>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">Authorization: Bearer YOUR_API_KEY</div>
      <h3>Getting an API Key</h3>
      <ol>
        <li>Sign in to your dashboard</li>
        <li>Navigate to Settings → API Keys</li>
        <li>Click &quot;Generate New Key&quot;</li>
        <li>Copy your key securely</li>
      </ol>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm"><strong>Important:</strong> Keep your API key secure. Do not share it in public repositories or client-side code.</p>
      </div>
    </div>
  );
}
