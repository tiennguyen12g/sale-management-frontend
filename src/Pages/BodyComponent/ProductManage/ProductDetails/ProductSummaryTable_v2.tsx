import React, { useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./ProductSummaryTable_v2.module.scss";
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

interface Props {
  ordersData: OrderDataFromServerType[];
}

export default function ProductSummaryTable_v2({ ordersData }: Props) {
  const [sortKey, setSortKey] = useState<keyof ProductStats>("performanceScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  let serverOriginalOrderData: OriginalOrder[] = [];
  let serverFinalOrderData: FinalOrder[] = [];

  console.log('order', ordersData);
  // aggregate orders into product stats
  const productStats: ProductStats[] = useMemo(() => {
    const map = new Map<string, ProductStats>();

    // calculate successRate + performance

    ordersData.forEach((order: OrderDataFromServerType) => {
      let serverOriginalOrderData: OriginalOrder = order.original;
      let serverFinalOrderData: FinalOrder = order.final;
      const productId = order.orderCode.split("-")[0];

      if (!map.has(productId)) {
        map.set(productId, {
          productName: productId,
          totalShipped: 0,
          totalQuantity: 0,
          totalSuccess: 0,
          totalReturn: 0,
          totalLost: 0,
          totalCOD: 0,
          successRate: 0,
          performanceScore: 0,
        });
      }
      const stats = map.get(productId)!;
      if (order.deliveryDetails && order.deliveryDetails.shippedTime !== "" && typeof order.deliveryDetails.shippedTime === "string") {
        stats.totalShipped += 1;
      }

      // only consider confirmed orders
      if (order.deliveryDetails && order.deliveryDetails.deliveryStatus === "Giao thành công") {
        stats.totalSuccess += 1;
        order.final.orderInfo.forEach((item) => {
          stats.totalCOD += item.quantity * item.price;
        });
      } else if (order.deliveryDetails && order.deliveryDetails.deliveryStatus === "Đã nhận hoàn") {
        // broken item in here
        stats.totalReturn += 1;
        // order.final.orderInfo.forEach((item) => {
        //   stats.totalReturn += item.quantity;
        // });
      } else if (order.deliveryDetails && order.deliveryDetails.deliveryStatus === "Mất hàng") {
        order.final.orderInfo.forEach((item) => {
          stats.totalLost += item.quantity;
        });
      }
    });

    map.forEach((stats) => {
      const total = stats.totalSuccess + stats.totalReturn + stats.totalLost;
      stats.successRate = total > 0 ? stats.totalSuccess / total : 0;
      stats.performanceScore = stats.totalCOD * stats.successRate;
    });

    return Array.from(map.values());
  }, [ordersData]);

  console.log("productStats", productStats);

  // sorting
  const sortedStats = useMemo(() => {
    return [...productStats].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [productStats, sortKey, sortOrder]);

  const handleSort = (key: keyof ProductStats) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  return (
    <div className={cx("product-summary")}>
      <h2>Product Performance Summary</h2>
      <div className={cx("sort-buttons")}>
        <button onClick={() => handleSort("totalCOD")}>Sort by COD</button>
        <button onClick={() => handleSort("totalSuccess")}>Sort by Success</button>
        <button onClick={() => handleSort("totalReturn")}>Sort by Return</button>
        <button onClick={() => handleSort("performanceScore")}>Sort by Performance</button>
      </div>
      <table className={cx("summary-table")}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Total Delivery</th>
            <th>Success</th>
            <th>Return</th>
            <th>Lost</th>
            <th>Broken</th>
            <th>Total COD Value</th>
            <th>Success Rate (%)</th>
            <th>Performance Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((p) => (
            <tr key={p.productName}>
              <td>{p.productName}</td>
              <td>{p.totalShipped}</td>
              <td className={cx("success")}>{p.totalSuccess}</td>
              <td className={cx("return")}>{p.totalReturn}</td>
              <td className={cx("lost")}>{p.totalLost}</td>
              <td className={cx("lost")}>{p.totalLost}</td>
              <td>{p.totalCOD.toLocaleString()}</td>
              <td data-rate-high={p.successRate >= 0.8} data-rate-medium={p.successRate >= 0.5 && p.successRate < 0.8} data-rate-low={p.successRate < 0.5}>
                {(p.successRate * 100).toFixed(1)}%
              </td>
              <td>{p.performanceScore.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
