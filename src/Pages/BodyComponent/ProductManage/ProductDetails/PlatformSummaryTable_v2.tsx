import React, { useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./PlatformSummaryTable_v2.module.scss";

import type { OrderDataFromServerType, FinalOrder, OriginalOrder } from "../../../../zustand/shopOrderStore";

const cx = classNames.bind(styles);

interface ProductStats {
  productName: string;
  totalQuantity: number;
  totalShipped: number;
  totalSuccess: number;
  totalReturn: number;
  totalLost: number;
  totalCOD: number;
  successRate: number;
  performanceScore: number;
}

interface PlatformStats {
  platformName: string;

  totalShipped: number;
  totalCOD: number;

  totalSuccess: number;
  totalSuccessCOD: number;

  totalReturn: number;
  totalReturnCOD: number;

  totalLost: number;
  totalLostCOD: number;

  successRate: number;
  performanceScore: number;

  totalQuantity: number;
}

interface Props {
  ordersData: OrderDataFromServerType[];
}

export default function PlatformSummaryTable_v2({ ordersData }: Props) {
  const [sortKey, setSortKey] = useState<keyof PlatformStats>("performanceScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  let serverOriginalOrderData: OriginalOrder[] = [];
  let serverFinalOrderData: FinalOrder[] = [];

  const platformStats: PlatformStats[] = useMemo(() => {
    const map = new Map<string, PlatformStats>();

    const platformNames = ["All", "Tiktok", "Shopee", "Facebook", "Landing"];
    const platformDetect = [""];
    platformNames.forEach((name) => {
      map.set(name, {
        platformName: name,
        totalShipped: 0,
        totalCOD: 0,

        totalSuccess: 0,
        totalSuccessCOD: 0,

        totalReturn: 0,
        totalReturnCOD: 0,

        totalLost: 0,
        totalLostCOD: 0,

        successRate: 0,
        performanceScore: 0,

        totalQuantity: 0,
      });
    });

    ordersData.forEach((order: OrderDataFromServerType) => {
      const website = order.final?.website?.trim().toLowerCase() || "";

      const platforms: string[] = ["All"];
      if (website.includes("facebook")) platforms.push("Facebook");
      if (website.includes("tiktok")) platforms.push("Tiktok");
      if (website.includes("web") || website.includes("landing")) platforms.push("Landing");
      if (website.includes("shopee")) platforms.push("Shopee");

      // console.log('website.includes("landing")', website.includes("landing"));

      platforms.forEach((platformName) => {
        // if (!website.includes(platformName.toLowerCase())) return;
        const stats = map.get(platformName);
        if (!stats) return;
        const status = order.final.status;
        const deliveryStatus = order.deliveryDetails?.deliveryStatus;
        const shippedTime = order.deliveryDetails?.shippedTime;
        const items = order.final?.orderInfo || [];
        if (status !== "Chốt" || shippedTime === "") {
          // console.log("SKIPPED:", order.orderCode, "status:", status, "shippedTime:", shippedTime);
          return;
        }

        if (shippedTime && shippedTime !== "" && typeof shippedTime === "string") {
          stats.totalShipped += 1;
          order.final.orderInfo.forEach((item) => {
            stats.totalCOD += item.quantity * item.price;
          });
        }

        if (deliveryStatus === "Giao thành công") {
          stats.totalSuccess += 1;
          items.forEach((item) => {
            const cod = item.quantity * item.price;
            stats.totalSuccessCOD += cod;
            stats.totalQuantity += item.quantity;
          });
        } else if (deliveryStatus === "Đã nhận hoàn") {
          stats.totalReturn += 1;

          items.forEach((item) => {
            const cod = item.quantity * item.price;

            stats.totalReturnCOD += cod;
            stats.totalQuantity += item.quantity;
          });
        } else if (deliveryStatus === "Mất hàng") {
          stats.totalLost += 1;

          items.forEach((item) => {
            const cod = item.quantity * item.price;

            stats.totalLostCOD += cod;
            stats.totalQuantity += item.quantity;
          });
        }
      });
    });

    map.forEach((stats) => {
      const totalOrders = stats.totalSuccess + stats.totalReturn + stats.totalLost;
      stats.successRate =  stats.totalSuccess / stats.totalShipped || 0;
      stats.performanceScore = stats.totalSuccessCOD * stats.successRate;
    });

    return Array.from(map.values());
  }, [ordersData]);

  // console.log("plat", platformStats);

  // sorting
  const sortedStats = useMemo(() => {
    return [...platformStats].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [platformStats, sortKey, sortOrder]);

  const handleSort = (key: keyof PlatformStats) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const HeaderHTMLTable_2 = (header: string) => {
    return (
      <React.Fragment>
        <div className={cx("above-header")}>{header}</div>
        <div className={cx("below-header")}>
          <div>Quantity</div>
          <div>Value</div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className={cx("product-summary")}>
      <h2>Platform Performance Summary</h2>
      <div className={cx("sort-buttons")}>
        <button onClick={() => handleSort("totalCOD")}>Sort by COD</button>
        <button onClick={() => handleSort("totalSuccess")}>Sort by Success</button>
        <button onClick={() => handleSort("totalReturn")}>Sort by Return</button>
        <button onClick={() => handleSort("performanceScore")}>Sort by Performance</button>
      </div>
      <div className={cx("summary-table")}>
        <div className={cx("table-header")}>
          <div className={cx("row")}>
            <div className={cx("cell", "product")}>Platform</div>
            <div className={cx("cell", "header-field")}>{HeaderHTMLTable_2("Total Delivery")}</div>
            <div className={cx("cell", "header-field")}>{HeaderHTMLTable_2("Success")}</div>
            <div className={cx("cell", "header-field")}>{HeaderHTMLTable_2("Return")}</div>
            <div className={cx("cell", "header-field")}>{HeaderHTMLTable_2("Lost")}</div>
            <div className={cx("cell", "header-field")}>{HeaderHTMLTable_2("Broken")}</div>
            {/* <div className={cx("cell")}>Total COD</div> */}
            <div className={cx("cell")}>Success Rate</div>
          </div>
        </div>

        <div className={cx("table-body")}>
          {sortedStats.map((p, i) => {
            const maxIndex = sortedStats.length - 1;
            return (
              <div className={cx(maxIndex === i ? "last-row" : "row")} key={p.platformName}>
                <div className={cx("cell")}>{p.platformName}</div>
                <div className={cx("cell")}>
                  <div className={cx("order-value")}>
                    <div>{p.totalShipped}</div>
                    <div>{p.totalCOD.toLocaleString("vi-VN")} đ</div>
                  </div>
                </div>
                <div className={cx("cell")}>
                  <div className={cx("order-value")}>
                    <div>{p.totalSuccess}</div>
                    <div>{p.totalSuccessCOD.toLocaleString("vi-VN")} đ</div>
                  </div>
                </div>
                <div className={cx("cell")}>
                  <div className={cx("order-value")}>
                    <div>{p.totalReturn}</div>
                    <div>{p.totalReturnCOD.toLocaleString("vi-VN")} đ</div>
                  </div>
                </div>
                <div className={cx("cell")}>
                  <div className={cx("order-value")}>
                    <div>{p.totalLost}</div>
                    <div>{p.totalLostCOD.toLocaleString("vi-VN")} đ</div>
                  </div>
                </div>
                <div className={cx("cell")}>
                  <div className={cx("order-value")}>
                    <div>{0}</div>
                    <div>{0}</div>
                  </div>
                </div>
                {/* <div className={cx("cell")}>{p.totalCOD}</div> */}
                <div className={cx("cell")}>{(p.successRate * 100).toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
