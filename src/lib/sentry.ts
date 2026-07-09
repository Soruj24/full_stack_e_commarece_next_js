import * as Sentry from "@sentry/nextjs";

export function initializeSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      integrations: [
        Sentry.httpIntegration(),
        Sentry.replayIntegration(),
      ],
      beforeSend(event) {
        if (process.env.NODE_ENV === "development") {
          console.log("Sentry event:", event);
        }
        return event;
      },
    });
  }
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else if (process.env.NODE_ENV === "development") {
    console.error("Error (Sentry disabled):", error, context);
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
}
