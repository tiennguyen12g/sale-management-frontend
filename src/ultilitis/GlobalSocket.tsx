import { useEffect } from "react";
import { getSocket } from "../zustand/socketService";

export default function GlobalSocket() {
  useEffect(() => {
    const socket = getSocket();
    socket.on("connect", () => console.log("connected"));
    socket.on("disconnect", () => console.log("disconnected"));

    return () => {
      // no disconnect here → keep alive globally
    };
  }, []);
  return null;
}
