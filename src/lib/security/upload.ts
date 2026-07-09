// Allowed MIME types and extensions
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_DIMENSIONS = { width: 4096, height: 4096 };

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileType(file: File, allowedTypes: string[] = ALLOWED_IMAGE_TYPES): FileValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): FileValidationResult {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
    };
  }
  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }
  return { valid: true };
}

export function validateFileExtension(
  filename: string,
  allowedExtensions: string[] = ALLOWED_IMAGE_EXTENSIONS
): FileValidationResult {
  const ext = "." + filename.split(".").pop()?.toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension: ${ext}. Allowed: ${allowedExtensions.join(", ")}`,
    };
  }
  return { valid: true };
}

export function validateUpload(file: File): FileValidationResult {
  const typeCheck = validateFileType(file);
  if (!typeCheck.valid) return typeCheck;

  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;

  const extCheck = validateFileExtension(file.name);
  if (!extCheck.valid) return extCheck;

  return { valid: true };
}
