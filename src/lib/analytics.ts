// lib/analytics.ts

type GAEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

/**
 * Log custom events to Google Analytics
 */
export const trackEvent = ({
  action,
  category,
  label,
  value,
  ...rest
}: GAEvent) => {
  if (typeof window !== "undefined" && (window as { gtag?: unknown }).gtag) {
    (
      window as unknown as {
        gtag: (
          cmd: string,
          event: string,
          params?: Record<string, unknown>,
        ) => void;
      }
    ).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest,
    });
  } else {
    // Fallback for development or if GA is not loaded
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA Event] ${category} > ${action}:`, {
        label,
        value,
        ...rest,
      });
    }
  }
};

/**
 * Common event categories
 */
export const ANALYTICS_CATEGORIES = {
  ECOMMERCE: "ecommerce",
  USER: "user",
  ENGAGEMENT: "engagement",
  NAVIGATION: "navigation",
};

/**
 * Common event actions
 */
export const ANALYTICS_ACTIONS = {
  ADD_TO_CART: "add_to_cart",
  REMOVE_FROM_CART: "remove_from_cart",
  VIEW_PRODUCT: "view_item",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  LOGIN: "login",
  SIGN_UP: "sign_up",
  SEARCH: "search",
};
