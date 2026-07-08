import { Socket } from "socket.io";

export function authenticateSocket(socket: Socket, next: (err?: Error) => void) {
  const userId = socket.handshake.auth?.userId;
  if (!userId) {
    return next(new Error("Authentication required"));
  }
  (socket as unknown as { userId: string }).userId = userId;
  next();
}
