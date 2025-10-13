import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import classNames from "classnames/bind";
import styles from "./WhoIsOnlineSocket.module.scss";
const cx = classNames.bind(styles);
import { useStaffStore } from "../zustand/staffStore";
import { socketAPI } from "../configs/api";

type StaffStatus = {
  staffID: string;
  name?: string;
  isOnline: boolean;
  lastSeen?: string | null;
};

export default function WhoIsOnlineSocket() {
    const {staffList} = useStaffStore();
  const [staffs, setStaffs] = useState<Record<string, StaffStatus>>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  // Initialize staff list when loaded from store
  useEffect(() => {
    if (staffList && staffList.length > 0) {
      const initialStaffs: Record<string, StaffStatus> = {};
      staffList.forEach((s) => {
        initialStaffs[s.staffID] = {
          staffID: s.staffID,
          name: s.staffInfo?.name,
          isOnline: false, // default until we get updates
          lastSeen: null,
        };
      });
      setStaffs(initialStaffs);
    }
  }, [staffList]);

  useEffect(() => {
    const s = io(socketAPI, {
      query: { manager: "true" }, // mark this as a manager connection
    });

    setSocket(s);

    // Listen for staff status changes
s.on("staff-status-changed", (data) => {
  if (!data.staffID || data.staffID === "none" || data.staffID === undefined) return; // ignore bad data
  setStaffs((prev) => ({
    ...prev,
    [data.staffID]: {
      ...(prev[data.staffID] || { staffID: data.staffID }),
      isOnline: data.status === "online",
      lastSeen:
        data.status === "offline"
          ? new Date().toISOString()
          : prev[data.staffID]?.lastSeen || null,
    },
  }));
});

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <div className={cx("manager-dashboard")}>
      <h2>Staff Online Status (WebSocket)</h2>
      <table className={cx("staff-table")}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Staff ID</th>
            <th>Status</th>
            <th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(staffs).length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: 20 }}>
                Waiting for updates…
              </td>
            </tr>
          ) : (
            Object.values(staffs).map((s) => (
              <tr key={s.staffID}>
                <td>{s.name}</td>
                <td>{s.staffID}</td>
                <td>
                  <span
                    className={cx("staff-status", s.isOnline ? "online" : "offline")}
                  >
                    {s.isOnline ? "🟢 Online" : "⚪ Offline"}
                  </span>
                </td>
                <td className={cx("staff-lastseen")}>
                  {s.lastSeen ? new Date(s.lastSeen).toLocaleString() : "—"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
