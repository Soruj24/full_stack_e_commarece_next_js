import { dbConnect } from "@/core/config/database";
import AuditLog from "@/core/database/models/AuditLog";

export interface AuditEvent {
  action: string;
  userId?: string;
  userEmail?: string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

const SENSITIVE_FIELDS = [
  "password", "passwordHash", "token", "secret", "key",
  "authorization", "cookie", "csrf", "jwt",
];

function sanitizeChanges(changes: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(changes)) {
    if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f))) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await dbConnect();
    await AuditLog.create({
      action: event.action,
      userId: event.userId || "system",
      userEmail: event.userEmail || "system",
      entityType: event.entityType,
      entityId: event.entityId || "unknown",
      changes: sanitizeChanges(event.changes || {}),
      ipAddress: event.ip || "unknown",
      userAgent: event.userAgent || "unknown",
      metadata: event.metadata,
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}

// Express middleware for request audit logging
export function auditMiddleware(event: Omit<AuditEvent, "ip" | "userAgent">) {
  return async (req: Request, _context?: unknown) => {
    const ip = req.headers.get("x-forwarded-for") || 
               req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    await logAuditEvent({ ...event, ip, userAgent });
  };
}

// Log with request context from Next.js API route
export async function logWithRequest(
  event: Omit<AuditEvent, "ip" | "userAgent">,
  request: Request
): Promise<void> {
  await logAuditEvent({
    ...event,
    ip: request.headers.get("x-forwarded-for") || 
        request.headers.get("x-real-ip") || "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  });
}
