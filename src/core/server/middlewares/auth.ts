import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET || "";

interface JwtPayload {
  userId: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token;
  const userId = socket.handshake.auth?.userId;

  // Token-based authentication (preferred)
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      (socket as unknown as { userId: string; userEmail?: string; userRole?: string }).userId = decoded.userId;
      (socket as unknown as { userEmail?: string }).userEmail = decoded.email;
      (socket as unknown as { userRole?: string }).userRole = decoded.role;
      return next();
    } catch {
      return next(new Error("Invalid or expired token"));
    }
  }

  // Fallback: userId only (for development, with warnings)
  if (userId) {
    if (process.env.NODE_ENV === "production") {
      return next(new Error("Authentication token required"));
    }
    console.warn("Socket connected without token authentication (dev mode)");
    (socket as unknown as { userId: string }).userId = userId;
    return next();
  }

  next(new Error("Authentication required"));
}
