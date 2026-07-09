type LogLevel = "info" | "warn" | "error" | "critical";

interface SecurityLogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  message: string;
  ip?: string;
  userId?: string;
  path?: string;
  method?: string;
  details?: Record<string, unknown>;
}

const SENSITIVE_KEYS = [
  "password", "secret", "token", "key", "authorization",
  "cookie", "jwt", "credit_card", "ssn", "email",
];

function sanitizeDetails(details: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeDetails(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function formatLogEntry(entry: SecurityLogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.event}] ${entry.message}`;
  if (entry.details && Object.keys(entry.details).length > 0) {
    return `${base} ${JSON.stringify(sanitizeDetails(entry.details))}`;
  }
  return base;
}

function createEntry(
  level: LogLevel,
  event: string,
  message: string,
  context?: Partial<SecurityLogEntry>
): SecurityLogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    event,
    message,
    ...context,
  };
}

export const securityLog = {
  info(event: string, message: string, context?: Partial<SecurityLogEntry>) {
    const entry = createEntry("info", event, message, context);
    // TODO: Remove console.log or replace with proper logging
    console.log(formatLogEntry(entry));
  },

  warn(event: string, message: string, context?: Partial<SecurityLogEntry>) {
    const entry = createEntry("warn", event, message, context);
    console.warn(formatLogEntry(entry));
  },

  error(event: string, message: string, context?: Partial<SecurityLogEntry>) {
    const entry = createEntry("error", event, message, context);
    console.error(formatLogEntry(entry));
  },

  critical(event: string, message: string, context?: Partial<SecurityLogEntry>) {
    const entry = createEntry("critical", event, message, context);
    console.error(formatLogEntry(entry));
  },

  // Log authentication events
  auth(event: string, userId?: string, ip?: string, details?: Record<string, unknown>) {
    this.info(`auth:${event}`, `Authentication event: ${event}`, {
      userId,
      ip,
      details,
    });
  },

  // Log access control events
  accessDenied(path: string, userId?: string, role?: string) {
    this.warn("access:denied", `Access denied to ${path}`, {
      path,
      userId,
      details: { role },
    });
  },

  // Log validation failures
  validationFailed(path: string, field?: string) {
    this.warn("validation:failed", `Validation failed for ${path}`, {
      path,
      details: { field },
    });
  },
};
