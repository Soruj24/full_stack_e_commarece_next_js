import { Book, Key, Zap, Shield, FileText } from "lucide-react";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface EndpointParam {
  name: string; type: string; required: boolean; description: string;
}

export interface Endpoint {
  method: Method;
  path: string;
  description: string;
  auth: boolean;
  category: string;
  params?: EndpointParam[];
  body?: EndpointParam[];
  response?: string;
}

export const sidebarItems = [
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

export const methodColors: Record<Method, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-yellow-100 text-yellow-700",
  PATCH: "bg-purple-100 text-purple-700",
  DELETE: "bg-red-100 text-red-700",
};

export const endpoints: Record<string, Endpoint[]> = {
  products: [
    { method: "GET", path: "/api/products", description: "Retrieve a list of all products", auth: false, category: "products",
      params: [
        { name: "page", type: "number", required: false, description: "Page number (default: 1)" },
        { name: "limit", type: "number", required: false, description: "Items per page (default: 20)" },
        { name: "category", type: "string", required: false, description: "Filter by category slug" },
        { name: "search", type: "string", required: false, description: "Search products by name" },
      ],
      response: '{\n  "success": true,\n  "products": [\n    {\n      "_id": "64a1b2c3d4e5f6789012345",\n      "name": "Product Name",\n      "slug": "product-name",\n      "price": 99.99,\n      "images": ["url1", "url2"],\n      "category": { "name": "Electronics" }\n    }\n  ],\n  "pagination": {\n    "page": 1,\n    "limit": 20,\n    "total": 100,\n    "totalPages": 5\n  }\n}',
    },
    { method: "GET", path: "/api/products/{id}", description: "Get a single product by ID", auth: false, category: "products",
      params: [{ name: "id", type: "string", required: true, description: "Product ID" }],
      response: '{\n  "success": true,\n  "product": {\n    "_id": "64a1b2c3d4e5f6789012345",\n    "name": "Product Name",\n    "description": "Full description...",\n    "price": 99.99,\n    "stock": 50,\n    "rating": 4.5,\n    "images": ["url1", "url2"]\n  }\n}',
    },
    { method: "POST", path: "/api/products", description: "Create a new product", auth: true, category: "products",
      body: [
        { name: "name", type: "string", required: true, description: "Product name" },
        { name: "description", type: "string", required: true, description: "Product description" },
        { name: "price", type: "number", required: true, description: "Product price" },
        { name: "category", type: "string", required: true, description: "Category ID" },
        { name: "stock", type: "number", required: false, description: "Stock quantity" },
        { name: "images", type: "array", required: false, description: "Image URLs" },
      ],
      response: '{\n  "success": true,\n  "product": {\n    "_id": "64a1b2c3d4e5f6789012345",\n    "name": "New Product"\n  }\n}',
    },
    { method: "PUT", path: "/api/products/{id}", description: "Update an existing product", auth: true, category: "products",
      params: [{ name: "id", type: "string", required: true, description: "Product ID" }],
      body: [
        { name: "name", type: "string", required: false, description: "Product name" },
        { name: "price", type: "number", required: false, description: "Product price" },
        { name: "stock", type: "number", required: false, description: "Stock quantity" },
      ],
      response: '{\n  "success": true,\n  "product": { ... }\n}',
    },
    { method: "DELETE", path: "/api/products/{id}", description: "Delete a product", auth: true, category: "products",
      params: [{ name: "id", type: "string", required: true, description: "Product ID" }],
      response: '{\n  "success": true,\n  "message": "Product deleted successfully"\n}',
    },
  ],
  orders: [
    { method: "GET", path: "/api/orders", description: "Get all orders for the authenticated user", auth: true, category: "orders",
      response: '{\n  "success": true,\n  "orders": [\n    {\n      "_id": "64a1b2c3d4e5f6789012345",\n      "orderStatus": "processing",\n      "totalAmount": 299.99,\n      "createdAt": "2024-01-20T12:00:00Z"\n    }\n  ]\n}',
    },
    { method: "POST", path: "/api/orders", description: "Create a new order", auth: true, category: "orders",
      body: [
        { name: "items", type: "array", required: true, description: "Order items" },
        { name: "shippingAddress", type: "object", required: true, description: "Shipping address" },
        { name: "paymentMethod", type: "string", required: true, description: "stripe, paypal, cod" },
      ],
      response: '{\n  "success": true,\n  "order": {\n    "_id": "64a1b2c3d4e5f6789012345",\n    "orderStatus": "processing",\n    "totalAmount": 299.99\n  }\n}',
    },
    { method: "GET", path: "/api/orders/{id}", description: "Get a specific order by ID", auth: true, category: "orders",
      params: [{ name: "id", type: "string", required: true, description: "Order ID" }],
      response: '{\n  "success": true,\n  "order": { ... }\n}',
    },
  ],
  users: [
    { method: "GET", path: "/api/users/me", description: "Get the authenticated user's profile", auth: true, category: "users",
      response: '{\n  "success": true,\n  "user": {\n    "_id": "64a1b2c3d4e5f6789012345",\n    "name": "John Doe",\n    "email": "john@example.com",\n    "role": "user"\n  }\n}',
    },
    { method: "PUT", path: "/api/users/me", description: "Update the authenticated user's profile", auth: true, category: "users",
      body: [
        { name: "name", type: "string", required: false, description: "Full name" },
        { name: "phone", type: "string", required: false, description: "Phone number" },
        { name: "bio", type: "string", required: false, description: "User bio" },
      ],
      response: '{\n  "success": true,\n  "user": { ... }\n}',
    },
  ],
  payments: [
    { method: "POST", path: "/api/payments/create-intent", description: "Create a Stripe payment intent", auth: true, category: "payments",
      body: [
        { name: "amount", type: "number", required: true, description: "Amount in cents" },
        { name: "currency", type: "string", required: true, description: "Currency code (usd, eur)" },
      ],
      response: '{\n  "success": true,\n  "clientSecret": "pi_xxx_secret_xxx",\n  "paymentIntentId": "pi_xxx"\n}',
    },
  ],
};
