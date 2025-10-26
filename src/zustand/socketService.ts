// socketService.ts
// import { io, Socket } from "socket.io-client";
// import { socketAPI } from "../configs/api";
// let socket: Socket | null = null;

// export const getSocket = () => {
//   if (!socket) {
//     socket = io(socketAPI, {
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 2000,
//     });
//   }
//   return socket;
// };

// socketService.ts
import { io, Socket } from "socket.io-client";
import { socketAPI } from "../configs/api";
import { useStaffStore } from "./staffStore";
import { useAuthStore } from "./authStore";
let socket: Socket | null = null;

export const getSocket = (staffID: string) => {
  if (!socket) {

    socket = io(socketAPI, {
      query: { staffID: staffID},
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => console.log("✅ Connected to socket"));
    socket.on("disconnect", () => console.log("❌ Disconnected from socket"));
    socket.on("message:new", (msg) => console.log("💬 New message received:", msg));
  }
  return socket;
};
