import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { io, Socket } from "socket.io-client";
import { socketAPI } from "../configs/api";

interface Props {
  staffID: string, 
  setStatusOutside? : Dispatch<SetStateAction<string | null>>
}
export default function StaffTracking({ staffID, setStatusOutside }: Props) {
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

  const onlineText = <div>
    <span style={{fontSize: 18}}>🟢</span>
    <span style={{marginLeft: 10, color: "#1b9703"}}>Online</span>
  </div>
  const offlineText = <div>
    <span style={{fontSize: 18}}>⚪</span>
    <span style={{marginLeft: 10, color: "#f72435"}}>Offline</span>
  </div>

  return (
    <div >
      {status === "online" ? onlineText : offlineText}
    </div>
  );
}
//"🟢 Online" 