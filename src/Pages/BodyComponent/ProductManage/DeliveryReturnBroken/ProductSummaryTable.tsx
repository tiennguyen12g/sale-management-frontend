import React, { useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./ProductSummaryTable.module.scss";
import { ordersData } from "./DeliveryReturnType";
import type { OrderType } from "./DeliveryReturnType";

const cx = classNames.bind(styles);

interface ProductStats {
  productName: string;
  totalQuantity: number;
  totalSuccess: number;
  totalReturn: number;
  totalLost: number;
  totalCOD: number;
  successRate: number;
  performanceScore: number;
}

export default function ProductSummaryTable() {
  const [sortKey, setSortKey] = useState<keyof ProductStats>("performanceScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // aggregate orders into product stats
  const productStats: ProductStats[] = useMemo(() => {
    const map = new Map<string, ProductStats>();

    ordersData.forEach((order: OrderType) => {
      order.productInfos.forEach((p) => {
        if (!map.has(p.productName)) {
          map.set(p.productName, {
            productName: p.productName,
            totalQuantity: 0,
            totalSuccess: 0,
            totalReturn: 0,
            totalLost: 0,
            totalCOD: 0,
            successRate: 0,
            performanceScore: 0,
          });
        }
        const stats = map.get(p.productName)!;
        stats.totalQuantity += p.quantity;
        // only consider confirmed orders
        if (order.statusOrder === "success") {
          stats.totalSuccess += p.quantity;
          stats.totalCOD += order.codValue;
        } else if (order.statusOrder === "return") {
          stats.totalReturn += p.quantity;
        } else if (order.statusOrder === "lost") {
          stats.totalLost += p.quantity;
        }
      });
    });

    // calculate successRate + performance
    map.forEach((stats) => {
      const total = stats.totalSuccess + stats.totalReturn + stats.totalLost;
      stats.successRate = total > 0 ? stats.totalSuccess / total : 0;
      stats.performanceScore = stats.totalCOD * stats.successRate;
    });

    return Array.from(map.values());
  }, []);

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
            <th>Total COD Value</th>
            <th>Success Rate (%)</th>
            <th>Performance Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((p) => (
            <tr key={p.productName}>
              <td>{p.productName}</td>
              <td>{p.totalQuantity}</td>
              <td className={cx("success")}>{p.totalSuccess}</td>
              <td className={cx("return")}>{p.totalReturn}</td>
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
