import { Server } from "socket.io";
import { setupNotificationHandlers } from "../controllers/NotificationController";

export function setupRoutes(io: Server) {
  setupNotificationHandlers(io);
}