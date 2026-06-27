export function ApiIntroduction() {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2>Introduction</h2>
        <p>Welcome to the API documentation. Our REST API allows you to integrate our platform with your applications. The API follows standard REST conventions and uses JSON for request and response bodies.</p>
        <h3>Base URL</h3>
        <div className="bg-muted rounded-lg p-4 font-mono text-sm">https://api.example.com/v1</div>
        <h3>Request Format</h3>
        <p>All requests should include the following headers:</p>
        <ul>
          <li><code>Content-Type: application/json</code></li>
          <li><code>Accept: application/json</code></li>
        </ul>
      </div>
    </div>
  );
}
