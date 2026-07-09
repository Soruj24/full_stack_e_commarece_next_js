// HTML/script tag stripping for user input
export function stripHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")       // Remove HTML tags
    .replace(/[<>]/g, "")           // Remove remaining angle brackets
    .replace(/javascript\s*:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "")     // Remove event handlers
    .trim();
}

// Sanitize object recursively (strips HTML from all string fields)
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = stripHtml(result[key] as string);
    } else if (typeof result[key] === "object" && result[key] !== null) {
      (result as Record<string, unknown>)[key] = sanitizeObject(
        result[key] as Record<string, unknown>
      );
    }
  }
  return result;
}

// Escape MongoDB regex special characters
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Sanitize filename (remove path traversal, keep safe chars)
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.\./g, "")
    .replace(/[/\\]/g, "")
    .substring(0, 255);
}

// Strip non-printable characters
export function stripNonPrintable(str: string): string {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

// Comprehensive sanitization pipeline
export function sanitizeInput(str: string): string {
  return stripNonPrintable(stripHtml(str));
}
