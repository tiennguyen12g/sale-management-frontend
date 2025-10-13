import { useMemo, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import classNames from "classnames/bind";
import styles from "./OperatingCostsChart.module.scss";
const cx = classNames.bind(styles);

import { useOperatingCostsStore } from "../../../../zustand/operatingCostsStore";

// import { operatingCostsData } from "../DataTest/DataForOperatingCost";
import type { OperatingCostsDataType } from "../DataTest/DataForOperatingCost";

export default function OperatingCostsChart() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { costs, fetchCosts, addCost, updateCost, deleteCost, loading } = useOperatingCostsStore();

  // Gom dữ liệu theo tháng
  const chartData = useMemo(() => {
    const aggregated: Record<
      string,
      { month: string; [key: string]: number | string }
    > = {};

    costs.forEach((item) => {
      const month = item.date.slice(0, 7); // YYYY-MM
      if (!aggregated[month]) {
        aggregated[month] = { month };
      }
      aggregated[month][item.action] =
        (aggregated[month][item.action] as number | undefined || 0) +
        item.value;
    });

    // Sắp xếp tháng tăng dần
    return Object.values(aggregated).sort((a, b) =>
      (a.month as string).localeCompare(b.month as string)
    );
  }, []);

  // Auto scroll sang phải khi mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [chartData]);

  return (
    <div className={cx("chart-scroll-container")} ref={scrollRef}>
      <div
        className={cx("chart-inner")}
        style={{ minWidth: `${chartData.length * 120}px`, height: "400px" }}
      >
        <LineChart
          data={chartData}
          width={chartData.length * 120} // mở rộng theo số lượng tháng
          height={400}
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />
          <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
          <Legend />
          <Line type="monotone" dataKey="electric" stroke="#8884d8" />
          <Line type="monotone" dataKey="water" stroke="#82ca9d" />
          <Line type="monotone" dataKey="internet" stroke="#ffc658" />
          <Line type="monotone" dataKey="phone" stroke="#ff7300" />
          <Line type="monotone" dataKey="software" stroke="#00c49f" />
          <Line type="monotone" dataKey="othercost" stroke="#ff0000" />
        </LineChart>
      </div>
    </div>
  );
}