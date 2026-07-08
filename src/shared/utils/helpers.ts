export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const getFallbackImage = (category?: string) => {
  const map: Record<string, string> = {
    electronics: "https://picsum.photos/seed/electronics/800/600",
    clothing: "https://picsum.photos/seed/clothing/800/600",
    accessories: "https://picsum.photos/seed/accessories/800/600",
    home: "https://picsum.photos/seed/home/800/600",
  };
  const key = category?.toLowerCase() || "default";
  return (
    map[key] || "https://picsum.photos/seed/default/800/600"
  );
};

export function getSafeImageSrc(
  img: string | undefined,
  categorySlug?: string,
): string {
  if (img === "/products/headset.jpg" || img === "products/headset.jpg") {
    return "https://picsum.photos/seed/headset/800/600";
  }

  if (img?.includes("www.freepik.com")) {
    return getFallbackImage(categorySlug);
  }

  if (
    img?.includes("photo-1566576912902-1d6f21223d7e") ||
    img?.includes("photo-1612817288484-96502e8de7d7")
  ) {
    return getFallbackImage(categorySlug);
  }

  if (img && typeof img === "string" && img.trim() !== "") {
    return img;
  }
  const fallback = getFallbackImage(categorySlug);
  if (fallback && typeof fallback === "string" && fallback.trim() !== "") {
    return fallback;
  }
  return "/placeholder-product.svg";
}
