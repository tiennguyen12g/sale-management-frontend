import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { socketAPI } from "../configs/api";
export default function StaffTracking({ staffID }: { staffID: string }) {
  const [status, setStatus] = useState<"online" | "offline">("offline");

  useEffect(() => {
    const socket: Socket = io(socketAPI, {
      query: { staffID },
    });

    // listen for status updates from server
    socket.on("status", (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, [staffID]);

  return (
    <div >
      {/* <h3>Staff: {staffID}</h3> */}
      <div style={{marginTop: 0}}>{status === "online" ? "🟢 Online" : "⚪ Offline"}</div>
    </div>
  );
}
