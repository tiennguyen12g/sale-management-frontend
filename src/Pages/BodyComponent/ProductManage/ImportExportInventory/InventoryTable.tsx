import React, { useState, useMemo, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ImportExportInventort_v2.module.scss";
const cx = classNames.bind(styles);
import { FaArrowDownLong } from "react-icons/fa6";
import { FaArrowUpLong } from "react-icons/fa6";
import type { ImportRecord, ExportRecord, OtherFeesType, BatchTrackingType, InventoryRecord } from "../../../../zustand/importExportStore";


interface Props {
  data: InventoryRecord[];
  onEdit: (item: InventoryRecord) => void;
  onDelete: (id: string) => void;
}
export default function InventoryTable({ data, onEdit, onDelete }: Props) {
  const [sortField, setSortField] = useState<"totalValue" | "currentStock">("totalValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortDir === "asc" ? valA - valB : valB - valA;
    });
  }, [data, sortField, sortDir]);

  return (
    <section>
      <div className={cx("btn-group")}>
        <button
          onClick={() => {
            setSortField("totalValue");
            setSortDir(sortDir === "asc" ? "desc" : "asc");
          }}
        >
          Sort by Value {sortDir === "desc" ? <FaArrowDownLong /> : <FaArrowUpLong />}
        </button>
        <button
          onClick={() => {
            setSortField("currentStock");
            setSortDir(sortDir === "asc" ? "desc" : "asc");
          }}
        >
          Sort by Stock {sortDir === "desc" ? <FaArrowDownLong /> : <FaArrowUpLong />}
        </button>
      </div>

      <table className={cx("table")}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Avg. Cost</th>
            <th>Total Value</th>
            <th>Warehouse</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>{item.currentStock}</td>
              <td>${item.averageCost}</td>
              <td>${item.totalValue}</td>
              <td>{item.warehouseLocation || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
