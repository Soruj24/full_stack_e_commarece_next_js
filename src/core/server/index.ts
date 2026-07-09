import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { setupRoutes } from "./routes";
import { SERVER_CONFIG } from "./config";
import { authenticateSocket } from "./middlewares/auth";

dotenv.config({ path: "../.env.local" });

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
  maxHttpBufferSize: 1e6, // 1MB max message size
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // CSP handled by Next.js
  crossOriginEmbedderPolicy: false, // Allow embedded resources
}));

app.use(cors({
  origin: SERVER_CONFIG.corsOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Socket.IO authentication
io.use(authenticateSocket);

setupRoutes(io);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

httpServer.listen(SERVER_CONFIG.port, () => {
  console.log(`Server running on port ${SERVER_CONFIG.port}`);
});

export { io, app };
