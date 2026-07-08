export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  VENDOR: "vendor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // User management
  MANAGE_USERS: "manage:users",
  VIEW_USERS: "view:users",

  // Product management
  MANAGE_PRODUCTS: "manage:products",
  VIEW_PRODUCTS: "view:products",
  CREATE_PRODUCTS: "create:products",
  EDIT_PRODUCTS: "edit:products",
  DELETE_PRODUCTS: "delete:products",

  // Order management
  MANAGE_ORDERS: "manage:orders",
  VIEW_ORDERS: "view:orders",
  PROCESS_ORDERS: "process:orders",
  CANCEL_ORDERS: "cancel:orders",

  // Category management
  MANAGE_CATEGORIES: "manage:categories",

  // Inventory
  MANAGE_INVENTORY: "manage:inventory",

  // Settings
  MANAGE_SETTINGS: "manage:settings",

  // Analytics
  VIEW_ANALYTICS: "view:analytics",

  // Reviews
  MODERATE_REVIEWS: "moderate:reviews",

  // Coupons
  MANAGE_COUPONS: "manage:coupons",

  // Vendors
  MANAGE_VENDORS: "manage:vendors",

  // Support
  MANAGE_SUPPORT: "manage:support",
  VIEW_SUPPORT: "view:support",

  // Own profile
  MANAGE_PROFILE: "manage:profile",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const rolePermissions: Record<Role, Permission[]> = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.VENDOR]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.PROCESS_ORDERS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_PROFILE,
    PERMISSIONS.VIEW_SUPPORT,
  ],

  [ROLES.USER]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.MANAGE_PROFILE,
    PERMISSIONS.VIEW_SUPPORT,
  ],
};

export function getPermissions(role: string): Permission[] {
  return rolePermissions[role as Role] || rolePermissions[ROLES.USER];
}

export function hasPermission(role: string, permission: Permission): boolean {
  return getPermissions(role).includes(permission);
}

export function hasAnyPermission(
  role: string,
  permissions: Permission[]
): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function hasAllPermissions(
  role: string,
  permissions: Permission[]
): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
