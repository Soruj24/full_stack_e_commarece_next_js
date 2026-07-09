import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Session } from "next-auth";
import { hasPermission, hasAnyPermission, type Permission, getPermissions } from "@/lib/permissions";

type RbacResult =
  | { authorized: false; response: NextResponse; session: null }
  | { authorized: true; response: null; session: Session };

export async function checkRole(allowedRoles: string[]): Promise<RbacResult> {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
      session: null,
    };
  }

  const userRole = session.user.role as string;

  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return {
    authorized: true,
    response: null,
    session: session as Session,
  };
}

export async function checkPermission(permission: Permission): Promise<RbacResult> {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
      session: null,
    };
  }

  const userRole = session.user.role as string;

  if (!hasPermission(userRole, permission)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return {
    authorized: true,
    response: null,
    session: session as Session,
  };
}

export async function checkAnyPermission(permissions: Permission[]): Promise<RbacResult> {
  const session = await auth();

  if (!session || !session.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      ),
      session: null,
    };
  }

  const userRole = session.user.role as string;

  if (!hasAnyPermission(userRole, permissions)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return {
    authorized: true,
    response: null,
    session: session as Session,
  };
}

export function getSessionPermissions(session: Session): Permission[] {
  return getPermissions(session.user.role as string);
}
