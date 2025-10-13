import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { StaffDataType } from "../../../../zustand/staffStore";
import classNames from "classnames/bind";
import styles from "./SaleStaffCharts.module.scss";
const cx = classNames.bind(styles);
interface SaleStaffChartsProps {
  staffList: StaffDataType[];
}

const SaleStaffCharts: React.FC<SaleStaffChartsProps> = ({ staffList }) => {
  const [filter, setFilter] = useState<"all" | "year">("all");
  const [year, setYear] = useState<string | null>(null);

  // Get all unique years from salaryHistory
  const allYears = useMemo(() => {
    const years = new Set<string>();
    staffList.forEach((s) => s.salaryHistory.forEach((h) => years.add(h.time.substring(0, 4))));
    return Array.from(years).sort();
  }, [staffList]);

  // transform data
  const chartData = useMemo(() => {
    let records: { time: string; [key: string]: number | string }[] = [];

    staffList
      .filter((s) => s.role === "Sale-Staff")
      .forEach((staff) => {
        staff.salaryHistory.forEach((h) => {
          let key = h.time;
          if (filter === "year") {
            if (year && !h.time.startsWith(year)) return; // filter by selected year
            key = h.time.substring(0, 7); // show monthly points in selected year
          }
          let rec = records.find((r) => r.time === key);
          if (!rec) {
            rec = { time: key };
            records.push(rec);
          }
          rec[`${staff.staffInfo.name}-orders`] = (Number(rec[`${staff.staffInfo.name}-orders`]) || 0) + h.totalCloseOrder;
          rec[`${staff.staffInfo.name}-rate`] = h.totalDistributionOrder > 0 ? ((h.totalCloseOrder / h.totalDistributionOrder) * 100).toFixed(1) : 0;
        });
      });

    return records.sort((a, b) => a.time.localeCompare(b.time));
  }, [staffList, filter, year]);
  return (
    <div style={{ marginTop: "24px" }}>
      {/* <h4>📈 Sale Staff Performance</h4> */}
      {/* Local Filter Buttons */}
      <div className={cx("chart-filters")}>
        <button
          className={cx({ active: filter === "all" })}
          onClick={() => {
            setFilter("all");
            setYear(null);
          }}
        >
          All Time
        </button>

        <button className={cx({ active: filter === "year" })} onClick={() => setFilter("year")}>
          Year
        </button>

        {filter === "year" && (
          <select value={year || ""} onChange={(e) => setYear(e.target.value || null)}>
            <option value="">All Years</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={cx('wrap-chart')}>
        {/* Chart 1: Close Orders */}
        <div style={{ height: 400, marginBottom: 40, overflowX: "auto", padding: "0px 0px" }}>
          <h5>Total Close Orders</h5>
          <div style={{ width: Math.max(chartData.length * 120, 800), height: "75%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {staffList
                  .filter((s) => s.role === "Sale-Staff")
                  .map((s, idx) => (
                    <Line key={idx} type="monotone" dataKey={`${s.staffInfo.name}-orders`} stroke={["#8884d8", "#82ca9d", "#ff7300"][idx % 3]} dot={false} />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Chart 2: Closing Rate */}
        <div style={{ height: 400, overflowX: "auto" }}>
          <h5>Closing Rate (%)</h5>
          <div style={{ width: Math.max(chartData.length * 120, 800), height: "75%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis unit="%" />
                <Tooltip />
                <Legend />
                {staffList
                  .filter((s) => s.role === "Sale-Staff")
                  .map((s, idx) => (
                    <Line
                      key={idx}
                      type="monotone"
                      dataKey={`${s.staffInfo.name}-rate`}
                      //   stroke={["#ff0000", "#0088fe", "#00c49f"][idx % 3]}
                      stroke={["#8884d8", "#82ca9d", "#ff7300"][idx % 3]}
                      dot={false}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleStaffCharts;
