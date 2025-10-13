// socketService.ts
import { io, Socket } from "socket.io-client";
import { socketAPI } from "../configs/api";
let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(socketAPI, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};
