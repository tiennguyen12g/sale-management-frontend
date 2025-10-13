import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import classNames from "classnames/bind";
import styles from "./AdsCostFeeChart.module.scss";
const cx = classNames.bind(styles);
// import { adsCosts } from "../DataTest/AdsCostsData";
import type { AdsCostType } from "../DataTest/AdsCostsData";
import { useAdsCostStore } from "../../../../zustand/adsCostStore";

interface Props {
  data: AdsCostType[];
}
type FilterType = "All" | "Month" | "Year";

export default function AdsCostFeeCharts() {
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [selectedMonth, setSelectedMonth] = useState("2025-08"); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState("2025");
    const { adsCosts} = useAdsCostStore();

  // Lọc dữ liệu theo filter
  const filteredData = adsCosts.filter((item) => {
    if (filterType === "Month") {
      return item.date.startsWith(selectedMonth);
    }
    if (filterType === "Year") {
      return item.date.startsWith(selectedYear);
    }
    return true; // All
  });

  // Gom dữ liệu platform
  const aggregated = filteredData.reduce((acc, item) => {
    if (!acc[item.platform]) {
      acc[item.platform] = {
        platform: item.platform,
        platformFee: 0,
        returnFee: 0,
      };
    }
    acc[item.platform].platformFee += item.platformFee || 0;
    acc[item.platform].returnFee += item.returnFee || 0;
    return acc;
  }, {} as Record<string, { platform: string; platformFee: number; returnFee: number }>);

  const chartData = Object.values(aggregated);

  return (
    <div style={{ width: "100%", display: "grid", gap: "24px" }}>
      {/* Filter controls */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button onClick={() => setFilterType("All")}>All time</button>
        <button onClick={() => setFilterType("Year")}>Year</button>
        <button onClick={() => setFilterType("Month")}>Month</button>

        {filterType === "Year" && <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={{ width: "100px" }} />}

        {filterType === "Month" && <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />}
      </div>

      {/* Platform Fee Chart */}
      {/* Platform Fee Chart */}
      <div>
        <h4>Platform Fee</h4>
        <div className={cx('chart-scroll-container')}>
          <div className={cx('chart-inner')}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />
                <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
                <Bar dataKey="platformFee" fill="#8884d8" name="Platform Fee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Return Fee Chart */}
      <div>
        <h4>Return Fee</h4>
        <div className="chart-scroll-container">
          <div className="chart-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />
                <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
                <Bar dataKey="returnFee" fill="#82ca9d" name="Return Fee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
