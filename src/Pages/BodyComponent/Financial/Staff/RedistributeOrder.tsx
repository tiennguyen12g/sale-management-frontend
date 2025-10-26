import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./RedistributeOrder.module.scss";
const cx = classNames.bind(styles);
import { RedistributionOrder_API } from "../../../../configs/api";
import { useShopOrderStore } from "../../../../zustand/shopOrderStore";
import NotificationBox_v2 from "../../../../ultilitis/NotificationBox_v2";
export function StaffRedistributeButton({ staffID, userId }: { staffID: string; userId: string }) {
  const [status, setStatus] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const { addArrayOrderDataFromServer } = useShopOrderStore();

  const handleClick = async () => {
    setStatus("⏳ Đang kiểm tra...");
    setShowNotification(true);
    try {
      const res = await fetch(RedistributionOrder_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffID, userId }),
      });
      const data = await res.json();
      console.log("data", data);
      if (data.locked) {
        setStatus(`⚠️ Phân phối lại đã được thực hiện bởi ${data.message}`);
      } else if (data.message === "Redistribution completed" && data.updates.length > 0) {
        await addArrayOrderDataFromServer(data.updates)
        setStatus(`✅ Đã phân phối lại: ${data.updates.length} đơn`);
      } else if (data.message === "Redistribution failed") {
        setStatus("❌ Phân phối lại thất bại");
      } else {
        console.log("data new", data.updates[0]);
        console.log("data", data);

        setStatus(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.log("err", err);
      setStatus("❌ Phân phối lại thất bại");
    }
  };

  return (
    <React.Fragment>
      <button className={cx("btn-decor")} onClick={handleClick}>
        Phân phối các đơn chưa được nhận
      </button>
      {showNotification && <NotificationBox_v2 message={status} onClose={() => setShowNotification(false)} />}
    </React.Fragment>
  );
}
