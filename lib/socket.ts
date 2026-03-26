"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = (userId: string) => {
  const socketInstance = getSocket();
  
  if (!socketInstance.connected) {
    socketInstance.connect();
    socketInstance.emit("join", userId);
  }
  
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export interface ServerToUserEvents {
  notification: (data: {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    link?: string;
    createdAt: string;
  }) => void;
  orderUpdate: (data: {
    orderId: string;
    status: string;
    message: string;
  }) => void;
  message: (data: {
    from: string;
    content: string;
    timestamp: string;
  }) => void;
}

export interface UserToServerEvents {
  join: (userId: string) => void;
  leave: (userId: string) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  sendNotification: (data: {
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    link?: string;
  }) => void;
}

declare global {
  interface Window {
    socket: Socket;
  }
}

if (typeof window !== "undefined") {
  window.socket = getSocket();
}
