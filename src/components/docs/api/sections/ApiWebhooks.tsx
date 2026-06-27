export function ApiWebhooks() {
  return (
    <div className="space-y-6">
      <h2>Webhooks</h2>
      <p>Receive real-time notifications about events in your account via webhooks.</p>
      <h3>Supported Events</h3>
      <ul>
        <li><code>order.created</code> - New order placed</li>
        <li><code>order.updated</code> - Order status changed</li>
        <li><code>order.delivered</code> - Order delivered</li>
        <li><code>payment.success</code> - Payment completed</li>
        <li><code>payment.failed</code> - Payment failed</li>
      </ul>
      <h3>Webhook Payload</h3>
      <div className="bg-muted rounded-lg p-4 font-mono text-sm">
{`{
  "event": "order.created",
  "timestamp": "2024-01-20T12:00:00Z",
  "data": {
    "orderId": "64a1b2c3d4e5f6789012345",
    "status": "processing"
  }
}`}
      </div>
    </div>
  );
}
