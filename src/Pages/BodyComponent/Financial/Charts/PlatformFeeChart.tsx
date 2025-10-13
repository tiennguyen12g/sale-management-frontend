import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import classNames from "classnames/bind";
import styles from "./PlatformFeeChart.module.scss";
const cx = classNames.bind(styles);
import { useAdsCostStore } from "../../../../zustand/adsCostStore";

type FilterType = "All" | "Month" | "Year";

export default function PlatformFeeChart() {
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [selectedYear, setSelectedYear] = useState("2025");
    const { adsCosts} = useAdsCostStore();
  // lọc theo năm/tháng
  const filteredData = adsCosts.filter((item) => {
    if (filterType === "Year") {
      return item.date.startsWith(selectedYear);
    }
    return true; // All
  });

  // gom dữ liệu theo tháng + platform
  const aggregated: Record<
    string,
    { month: string; TikTok: number; Facebook: number; Shopee: number }
  > = {};

  filteredData.forEach((item) => {
    const month = item.date.slice(0, 7); // YYYY-MM
    if (!aggregated[month]) {
      aggregated[month] = {
        month,
        TikTok: 0,
        Facebook: 0,
        Shopee: 0,
      };
    }
    aggregated[month][item.platform] += item.platformFee || 0; // hoặc returnFee tuỳ chart
  });

  const chartData = Object.values(aggregated);

  return (
    <div className={cx("chart-scroll-container")}>
        <h4>Platform Fee</h4>
      <div
        className={cx("chart-inner")}
        style={{
          minWidth: `${chartData.length * 250}px`, // mỗi tháng chiếm 250px
          height: "400px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={25}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />
            <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
            <Legend />
            <Bar dataKey="TikTok" fill="#0f0f0f" />
            <Bar dataKey="Facebook" fill="#4287f5" />
            <Bar dataKey="Shopee" fill="#f56a42" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
