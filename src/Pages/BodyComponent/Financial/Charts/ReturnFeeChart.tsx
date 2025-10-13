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
import styles from "./ReturnFeeChart.module.scss";
const cx = classNames.bind(styles);
import { useAdsCostStore } from "../../../../zustand/adsCostStore";
import type { AdsCostType } from "../DataTest/AdsCostsData";

type FilterType = "All" | "Month" | "Year";

// Gom dữ liệu theo tháng và field (platformFee hoặc returnFee)
function aggregateData(filteredData: AdsCostType[], field: "platformFee" | "returnFee") {

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
    aggregated[month][item.platform] += item[field] || 0;
  });

  return Object.values(aggregated);
}

export default function ReturnFeeChart() {
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [selectedYear, setSelectedYear] = useState("2025");
      const { adsCosts} = useAdsCostStore();
  // lọc theo năm
  const filteredData = adsCosts.filter((item) => {
    if (filterType === "Year") {
      return item.date.startsWith(selectedYear);
    }
    return true;
  });

  const platformFeeData = aggregateData(filteredData, "platformFee");
  const returnFeeData = aggregateData(filteredData, "returnFee");
  const barSizeCustom = 15;
  return (
    <div className={cx('wrapper')}>
      {/* Platform Fee Chart */}

      <div className={cx("chart-scroll-container")}>
              <h4 className="font-bold mb-2">Platform Fee</h4>
        <div
          className={cx("chart-inner")}
          style={{
            minWidth: `${platformFeeData.length * 200}px`, // mỗi tháng 200px
            height: "300px",
            // padding: "10px 20px"
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={platformFeeData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />
              <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
              <Legend />
              <Bar dataKey="TikTok" fill="#030303" barSize={barSizeCustom} />
              <Bar dataKey="Facebook" fill="#4287f5" barSize={barSizeCustom} />
              <Bar dataKey="Shopee" fill="#f56a42" barSize={barSizeCustom} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Return Fee Chart */}

      <div className={cx("chart-scroll-container")}>
              <h4 className="font-bold mb-2 mt-6">Return Fee</h4>
        <div
          className={cx("chart-inner")}
          style={{
            minWidth: `${returnFeeData.length * 200}px`,
            height: "300px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={returnFeeData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} />
              <Tooltip formatter={(v: number) => v.toLocaleString("vi-VN")} />
              <Legend />
              <Bar dataKey="TikTok" fill="#0a0a0a" barSize={barSizeCustom} />
              <Bar dataKey="Facebook" fill="#4287f5" barSize={barSizeCustom} />
              <Bar dataKey="Shopee" fill="#f56a42" barSize={barSizeCustom} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
