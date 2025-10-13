import { useEffect, useState } from "react";
import { socketAPI } from "../configs/api";
import { FaCartPlus } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import bellNotification from "./icons/bell.gif";
import { useShopOrderStore } from "../zustand/shopOrderStore";
export default function StaffNotification({ staffID }: { staffID: string }) {
  const [status, setStatus] = useState("disconnected");
  const [notifications, setNotifications] = useState<any[]>([]);
  const { addOrder, addOrderDataFromServer } = useShopOrderStore();

  useEffect(() => {
    const worker = new Worker(new URL("../workers/orderWorker.js", import.meta.url));

    worker.postMessage({
      type: "connect",
      staffID,
      serverUrl: socketAPI,
    });

    worker.onmessage = (e) => {
      if (e.data.type === "connected") {
        setStatus("connected");
      }
      if (e.data.type === "disconnected") {
        setStatus("disconnected");
      }
      if (e.data.type === "new-order") {
        setNotifications((prev) => [e.data.payload, ...prev]);
      }
    };

    return () => {
      worker.postMessage({ type: "disconnect" });
      worker.terminate();
    };
  }, [staffID]);

  useEffect(() => {
    if (notifications.length > 0) {
      // console.log('new ordr', notifications[notifications.length - 1].order);
      addOrderDataFromServer(notifications[notifications.length - 1].order);
    }
  }, [notifications]);
  return (
    <div style={{ padding: 0, fontFamily: "Arial", display: "flex", alignItems: "center", }}>
      {/* <h3>Staff {staffID} Notifications</h3> */}
      {/* <p>Status: {status === "connected" ? "🟢 Connected" : "⚪ Disconnected"}</p> */}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 550, fontSize: 16 }}>Đơn mới</div> <img src={bellNotification} width={35} height={35}/>:&nbsp;
      </div>
      {/* {notifications.length === 0 ? (
        <div style={{color: "#0485fd", fontWeight: 550, fontSize: 16,}}>&nbsp; Không có đơn...</div>
      ) : (
        <div style={{color: "#0485fd", fontWeight: 550, fontSize: 16,}}>{notifications.length} đơn</div>
      )} */}
      {notifications && <div style={{ color: "#0485fd", fontWeight: 550, fontSize: 16 }}>{notifications.length} đơn mới</div>}
    </div>
  );
}
