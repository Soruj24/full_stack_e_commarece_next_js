import { NextResponse } from "next/server";

const ROLES = [
  {
    id: "role_admin",
    name: "Administrator",
    slug: "admin",
    description: "Full access to all system features and settings",
    isSystem: true,
    userCount: 3,
    permissions: [
      "users.manage",
      "users.delete",
      "orders.manage",
      "orders.refund",
      "products.manage",
      "products.delete",
      "categories.manage",
      "settings.read",
      "settings.write",
      "reports.generate",
      "analytics.view",
      "roles.manage",
    ],
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "role_manager",
    name: "Manager",
    slug: "manager",
    description: "Can manage orders, products, and view analytics",
    isSystem: true,
    userCount: 7,
    permissions: [
      "orders.manage",
      "orders.refund",
      "products.manage",
      "categories.manage",
      "settings.read",
      "reports.generate",
      "analytics.view",
    ],
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "role_moderator",
    name: "Moderator",
    slug: "moderator",
    description: "Can manage reviews, support tickets, and user content",
    isSystem: true,
    userCount: 12,
    permissions: [
      "reviews.moderate",
      "support.respond",
      "users.view",
      "orders.view",
    ],
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "role_vendor",
    name: "Vendor",
    slug: "vendor",
    description: "Can manage own products and view own orders",
    isSystem: true,
    userCount: 45,
    permissions: [
      "products.manage",
      "products.view",
      "orders.view",
      "analytics.view_own",
    ],
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "role_support",
    name: "Support Agent",
    slug: "support",
    description: "Can respond to support tickets and view user details",
    isSystem: false,
    userCount: 8,
    permissions: [
      "support.respond",
      "support.tickets",
      "users.view",
      "orders.view",
    ],
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "role_analyst",
    name: "Analyst",
    slug: "analyst",
    description: "View-only access to analytics and reports",
    isSystem: false,
    userCount: 5,
    permissions: [
      "analytics.view",
      "reports.generate",
      "reports.view",
    ],
    createdAt: "2026-03-01T14:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      roles: ROLES,
      totalCount: ROLES.length,
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, slug, description, permissions } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { success: false, error: "Missing required fields: name, slug" },
      { status: 400 },
    );
  }

  if (ROLES.find((r) => r.slug === slug)) {
    return NextResponse.json(
      { success: false, error: "A role with this slug already exists" },
      { status: 409 },
    );
  }

  const newRole = {
    id: `role_${slug}`,
    name,
    slug,
    description: description || "",
    isSystem: false,
    userCount: 0,
    permissions: permissions || [],
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(
    { success: true, data: newRole },
    { status: 201 },
  );
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, name, description, permissions } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing required field: id" },
      { status: 400 },
    );
  }

  const role = ROLES.find((r) => r.id === id);
  if (!role) {
    return NextResponse.json(
      { success: false, error: "Role not found" },
      { status: 404 },
    );
  }

  const updatedRole = {
    ...role,
    name: name || role.name,
    description: description !== undefined ? description : role.description,
    permissions: permissions || role.permissions,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: updatedRole,
  });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing required field: id" },
      { status: 400 },
    );
  }

  const role = ROLES.find((r) => r.id === id);
  if (!role) {
    return NextResponse.json(
      { success: false, error: "Role not found" },
      { status: 404 },
    );
  }

  if (role.isSystem) {
    return NextResponse.json(
      { success: false, error: "System roles cannot be deleted" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    success: true,
    data: { id, deletedAt: new Date().toISOString() },
    message: `Role "${role.name}" deleted`,
  });
}
