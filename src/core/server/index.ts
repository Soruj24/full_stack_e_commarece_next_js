import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { setupRoutes } from "./routes";
import { SERVER_CONFIG } from "./config";

dotenv.config({ path: "../.env.local" });

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: SERVER_CONFIG.corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

setupRoutes(io);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

httpServer.listen(SERVER_CONFIG.port, () => {
  console.log(`Server running on port ${SERVER_CONFIG.port}`);
});

export { io, app };
