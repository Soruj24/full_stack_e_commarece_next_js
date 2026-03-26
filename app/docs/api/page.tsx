"use client";

import { useState } from "react";
import { 
  Book, 
  Code, 
  Copy, 
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Search,
  Menu,
  X,
  ArrowRight,
  Terminal,
  Key,
  Globe,
  Zap,
  Shield,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Endpoint {
  method: Method;
  path: string;
  description: string;
  auth: boolean;
  category: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  body?: { name: string; type: string; required: boolean; description: string }[];
  response?: string;
}

const sidebarItems = [
  { id: "introduction", label: "Introduction", icon: Book },
  { id: "authentication", label: "Authentication", icon: Key },
  { id: "rate-limits", label: "Rate Limits", icon: Zap },
  { id: "errors", label: "Error Handling", icon: Shield },
  { id: "products", label: "Products", icon: FileText },
  { id: "orders", label: "Orders", icon: FileText },
  { id: "users", label: "Users", icon: FileText },
  { id: "payments", label: "Payments", icon: FileText },
  { id: "webhooks", label: "Webhooks", icon: Zap },
];

const endpoints: Record<string, Endpoint[]> = {
  products: [
    {
      method: "GET",
      path: "/api/products",
      description: "Retrieve a list of all products",
      auth: false,
      category: "products",
      params: [
        { name: "page", type: "number", required: false, description: "Page number (default: 1)" },
        { name: "limit", type: "number", required: false, description: "Items per page (default: 20)" },
        { name: "category", type: "string", required: false, description: "Filter by category slug" },
        { name: "search", type: "string", required: false, description: "Search products by name" },
      ],
      response: `{
  "success": true,
  "products": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Product Name",
      "slug": "product-name",
      "price": 99.99,
      "images": ["url1", "url2"],
      "category": { "name": "Electronics" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}`,
    },
    {
      method: "GET",
      path: "/api/products/{id}",
      description: "Get a single product by ID",
      auth: false,
      category: "products",
      params: [
        { name: "id", type: "string", required: true, description: "Product ID" },
      ],
      response: `{
  "success": true,
  "product": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "Product Name",
    "description": "Full description...",
    "price": 99.99,
    "stock": 50,
    "rating": 4.5,
    "images": ["url1", "url2"]
  }
}`,
    },
    {
      method: "POST",
      path: "/api/products",
      description: "Create a new product",
      auth: true,
      category: "products",
      body: [
        { name: "name", type: "string", required: true, description: "Product name" },
        { name: "description", type: "string", required: true, description: "Product description" },
        { name: "price", type: "number", required: true, description: "Product price" },
        { name: "category", type: "string", required: true, description: "Category ID" },
        { name: "stock", type: "number", required: false, description: "Stock quantity" },
        { name: "images", type: "array", required: false, description: "Image URLs" },
      ],
      response: `{
  "success": true,
  "product": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "New Product"
  }
}`,
    },
    {
      method: "PUT",
      path: "/api/products/{id}",
      description: "Update an existing product",
      auth: true,
      category: "products",
      params: [
        { name: "id", type: "string", required: true, description: "Product ID" },
      ],
      body: [
        { name: "name", type: "string", required: false, description: "Product name" },
        { name: "price", type: "number", required: false, description: "Product price" },
        { name: "stock", type: "number", required: false, description: "Stock quantity" },
      ],
      response: `{
  "success": true,
  "product": { ... }
}`,
    },
    {
      method: "DELETE",
      path: "/api/products/{id}",
      description: "Delete a product",
      auth: true,
      category: "products",
      params: [
        { name: "id", type: "string", required: true, description: "Product ID" },
      ],
      response: `{
  "success": true,
  "message": "Product deleted successfully"
}`,
    },
  ],
  orders: [
    {
      method: "GET",
      path: "/api/orders",
      description: "Get all orders for the authenticated user",
      auth: true,
      category: "orders",
      response: `{
  "success": true,
  "orders": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "orderStatus": "processing",
      "totalAmount": 299.99,
      "createdAt": "2024-01-20T12:00:00Z"
    }
  ]
}`,
    },
    {
      method: "POST",
      path: "/api/orders",
      description: "Create a new order",
      auth: true,
      category: "orders",
      body: [
        { name: "items", type: "array", required: true, description: "Order items" },
        { name: "shippingAddress", type: "object", required: true, description: "Shipping address" },
        { name: "paymentMethod", type: "string", required: true, description: "stripe, paypal, cod" },
      ],
      response: `{
  "success": true,
  "order": {
    "_id": "64a1b2c3d4e5f6789012345",
    "orderStatus": "processing",
    "totalAmount": 299.99
  }
}`,
    },
    {
      method: "GET",
      path: "/api/orders/{id}",
      description: "Get a specific order by ID",
      auth: true,
      category: "orders",
      params: [
        { name: "id", type: "string", required: true, description: "Order ID" },
      ],
      response: `{
  "success": true,
  "order": { ... }
}`,
    },
  ],
  users: [
    {
      method: "GET",
      path: "/api/users/me",
      description: "Get the authenticated user's profile",
      auth: true,
      category: "users",
      response: `{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}`,
    },
    {
      method: "PUT",
      path: "/api/users/me",
      description: "Update the authenticated user's profile",
      auth: true,
      category: "users",
      body: [
        { name: "name", type: "string", required: false, description: "Full name" },
        { name: "phone", type: "string", required: false, description: "Phone number" },
        { name: "bio", type: "string", required: false, description: "User bio" },
      ],
      response: `{
  "success": true,
  "user": { ... }
}`,
    },
  ],
  payments: [
    {
      method: "POST",
      path: "/api/payments/create-intent",
      description: "Create a Stripe payment intent",
      auth: true,
      category: "payments",
      body: [
        { name: "amount", type: "number", required: true, description: "Amount in cents" },
        { name: "currency", type: "string", required: true, description: "Currency code (usd, eur)" },
      ],
      response: `{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}`,
    },
  ],
};

const methodColors: Record<Method, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-purple-100 text-purple-700",
  DELETE: "bg-red-100 text-red-700",
};

export default function ApiDocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "introduction":
        return (
          <div className="space-y-6">
            <div className="prose max-w-none">
              <h2>Introduction</h2>
              <p>
                Welcome to the API documentation. Our REST API allows you to integrate 
                our platform with your applications. The API follows standard REST conventions 
                and uses JSON for request and response bodies.
              </p>
              
              <h3>Base URL</h3>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                https://api.example.com/v1
              </div>
              
              <h3>Request Format</h3>
              <p>All requests should include the following headers:</p>
              <ul>
                <li><code>Content-Type: application/json</code></li>
                <li><code>Accept: application/json</code></li>
              </ul>
            </div>
          </div>
        );

      case "authentication":
        return (
          <div className="space-y-6">
            <h2>Authentication</h2>
            <p>
              Our API uses Bearer token authentication. Include your API key in the 
              Authorization header of every request.
            </p>
            
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </div>
            
            <h3>Getting an API Key</h3>
            <ol>
              <li>Sign in to your dashboard</li>
              <li>Navigate to Settings → API Keys</li>
              <li>Click "Generate New Key"</li>
              <li>Copy your key securely</li>
            </ol>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> Keep your API key secure. Do not share it 
                in public repositories or client-side code.
              </p>
            </div>
          </div>
        );

      case "rate-limits":
        return (
          <div className="space-y-6">
            <h2>Rate Limits</h2>
            <p>
              To ensure fair usage and platform stability, we implement rate limiting:
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-bold mb-2">Free Tier</h4>
                <p className="text-2xl font-black text-primary">100</p>
                <p className="text-sm text-muted-foreground">requests per minute</p>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-bold mb-2">Pro Tier</h4>
                <p className="text-2xl font-black text-primary">1,000</p>
                <p className="text-sm text-muted-foreground">requests per minute</p>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <h4 className="font-bold mb-2">Enterprise</h4>
                <p className="text-2xl font-black text-primary">10,000</p>
                <p className="text-sm text-muted-foreground">requests per minute</p>
              </div>
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

      case "errors":
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
              <div className="flex items-center gap-4">
                <Badge className="bg-green-100 text-green-700">200</Badge>
                <span>Success</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-yellow-100 text-yellow-700">400</Badge>
                <span>Bad Request - Invalid input</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-red-100 text-red-700">401</Badge>
                <span>Unauthorized - Invalid or missing API key</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-red-100 text-red-700">403</Badge>
                <span>Forbidden - Insufficient permissions</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-red-100 text-red-700">404</Badge>
                <span>Not Found - Resource doesn't exist</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-red-100 text-red-700">429</Badge>
                <span>Too Many Requests - Rate limit exceeded</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-red-100 text-red-700">500</Badge>
                <span>Internal Server Error</span>
              </div>
            </div>
          </div>
        );

      case "webhooks":
        return (
          <div className="space-y-6">
            <h2>Webhooks</h2>
            <p>
              Receive real-time notifications about events in your account via webhooks.
            </p>
            
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

      default:
        if (endpoints[sectionId]) {
          return (
            <div className="space-y-6">
              <h2>{sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} API</h2>
              {endpoints[sectionId].map((endpoint, idx) => {
                const endpointKey = `${endpoint.method}-${endpoint.path}`;
                const isExpanded = expandedEndpoint === endpointKey;
                
                return (
                  <div key={idx} className="bg-card rounded-xl border border-border/50 overflow-hidden">
                    <button
                      onClick={() => setExpandedEndpoint(isExpanded ? null : endpointKey)}
                      className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <Badge className={cn("font-mono font-bold shrink-0", methodColors[endpoint.method])}>
                        {endpoint.method}
                      </Badge>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => copyToClipboard(endpoint.response!)}
                              >
                                {copiedCode === endpoint.response ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                                {copiedCode === endpoint.response ? "Copied!" : "Copy"}
                              </Button>
                            </div>
                            <pre className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                              {endpoint.response}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold">API Reference</h1>
                <p className="text-xs text-muted-foreground">v1.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <code className="text-sm">curl https://api.example.com/v1</code>
            </div>
            <Button size="sm" className="gap-2">
              Get API Key
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <aside className={cn(
            "fixed lg:sticky top-[73px] left-0 w-64 h-[calc(100vh-73px)] bg-background border-r overflow-y-auto z-40 transition-transform lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <nav className="p-4 space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-12 min-h-[calc(100vh-73px)]">
            <div className="max-w-4xl">
              {renderSection(activeSection)}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
