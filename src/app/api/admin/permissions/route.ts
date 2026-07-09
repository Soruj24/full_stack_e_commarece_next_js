import { NextResponse } from "next/server";

const PERMISSION_GROUPS = [
  {
    group: "Users",
    permissions: [
      { id: "users.view", name: "View Users", description: "View user profiles and lists" },
      { id: "users.manage", name: "Manage Users", description: "Edit user details and roles" },
      { id: "users.delete", name: "Delete Users", description: "Remove users from the system" },
      { id: "users.impersonate", name: "Impersonate Users", description: "Log in as another user" },
    ],
  },
  {
    group: "Orders",
    permissions: [
      { id: "orders.view", name: "View Orders", description: "View order details and lists" },
      { id: "orders.manage", name: "Manage Orders", description: "Update order status and details" },
      { id: "orders.refund", name: "Process Refunds", description: "Issue refunds to customers" },
      { id: "orders.cancel", name: "Cancel Orders", description: "Cancel any order in the system" },
    ],
  },
  {
    group: "Products",
    permissions: [
      { id: "products.view", name: "View Products", description: "View product catalog" },
      { id: "products.manage", name: "Manage Products", description: "Add, edit, and duplicate products" },
      { id: "products.delete", name: "Delete Products", description: "Remove products from catalog" },
      { id: "products.inventory", name: "Manage Inventory", description: "Update stock levels and warehouses" },
    ],
  },
  {
    group: "Categories",
    permissions: [
      { id: "categories.view", name: "View Categories", description: "View category hierarchy" },
      { id: "categories.manage", name: "Manage Categories", description: "Create and edit categories" },
      { id: "categories.delete", name: "Delete Categories", description: "Remove categories" },
    ],
  },
  {
    group: "Reviews",
    permissions: [
      { id: "reviews.view", name: "View Reviews", description: "View all product reviews" },
      { id: "reviews.moderate", name: "Moderate Reviews", description: "Approve, reject, or flag reviews" },
      { id: "reviews.delete", name: "Delete Reviews", description: "Remove reviews from products" },
    ],
  },
  {
    group: "Support",
    permissions: [
      { id: "support.tickets", name: "Manage Tickets", description: "View and manage support tickets" },
      { id: "support.respond", name: "Respond to Tickets", description: "Reply to customer support tickets" },
      { id: "support.settings", name: "Support Settings", description: "Configure support system settings" },
    ],
  },
  {
    group: "Analytics",
    permissions: [
      { id: "analytics.view", name: "View Analytics", description: "Access analytics dashboard and reports" },
      { id: "analytics.view_own", name: "View Own Analytics", description: "View analytics relevant to own account" },
      { id: "analytics.export", name: "Export Analytics", description: "Download analytics data and reports" },
    ],
  },
  {
    group: "Reports",
    permissions: [
      { id: "reports.view", name: "View Reports", description: "Access generated reports" },
      { id: "reports.generate", name: "Generate Reports", description: "Create new reports from data" },
      { id: "reports.delete", name: "Delete Reports", description: "Remove generated reports" },
    ],
  },
  {
    group: "Settings",
    permissions: [
      { id: "settings.read", name: "Read Settings", description: "View system configuration" },
      { id: "settings.write", name: "Write Settings", description: "Modify system configuration" },
    ],
  },
  {
    group: "Roles",
    permissions: [
      { id: "roles.view", name: "View Roles", description: "View roles and their permissions" },
      { id: "roles.manage", name: "Manage Roles", description: "Create, edit, and assign roles" },
      { id: "roles.delete", name: "Delete Roles", description: "Remove custom roles" },
    ],
  },
  {
    group: "Marketing",
    permissions: [
      { id: "marketing.campaigns", name: "Manage Campaigns", description: "Create and manage marketing campaigns" },
      { id: "marketing.coupons", name: "Manage Coupons", description: "Create and manage discount coupons" },
      { id: "marketing.banners", name: "Manage Banners", description: "Manage homepage banners and promotions" },
    ],
  },
];

export async function GET() {
  const allPermissions = PERMISSION_GROUPS.flatMap((g) => g.permissions);
  return NextResponse.json({
    success: true,
    data: {
      groups: PERMISSION_GROUPS,
      permissions: allPermissions,
      totalCount: allPermissions.length,
    },
  });
}
