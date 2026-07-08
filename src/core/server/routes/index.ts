import { Server } from "socket.io";
import { setupNotificationHandlers } from "../controllers/notification-controller";

export function setupRoutes(io: Server) {
  setupNotificationHandlers(io);
}
