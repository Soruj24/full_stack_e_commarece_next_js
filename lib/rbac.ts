import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Session } from "next-auth";

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

  // Cast user role to string to match allowedRoles
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
