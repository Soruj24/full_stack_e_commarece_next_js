export const SERVER_CONFIG = {
  port: parseInt(process.env.SOCKET_PORT || "3001", 10),
  corsOrigin: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "",
};
