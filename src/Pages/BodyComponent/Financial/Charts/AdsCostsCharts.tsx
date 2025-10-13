import React, { useMemo, useState, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import classNames from "classnames/bind";
import styles from "./AdsCostsCharts.module.scss";
import type { AdsCostType } from "../DataTest/AdsCostsData";

const cx = classNames.bind(styles);

interface Props {
  data: AdsCostType[];
}

const COLORS = ["#0f0f0f", "#1877F2", "#FF6000"]; // TikTok, Facebook, Shopee

function getTicks(domainMin: number, domainMax: number, count: number): number[] {
  if (domainMax <= domainMin || count < 2) return [domainMin, domainMax];
  const step = (domainMax - domainMin) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(domainMin + i * step));
}

export default function AdsCostsCharts({ data }: Props) {
      const totalSpend = useMemo(() => data.reduce((sum, item) => sum + (item.spendActual || 0), 0), [data]);
  const totalRevenue = useMemo(() => data.reduce((sum, item) => sum + (item.netRevenue || 0), 0), [data]);
  // Pie chart data
  const spendPieData = useMemo(() => {
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      grouped[item.platform] = (grouped[item.platform] || 0) + item.spendActual;
    });
    return Object.keys(grouped).map((platform) => ({
      name: platform,
      value: grouped[platform],
      percent: totalSpend ? (grouped[platform] / totalSpend) * 100 : 0,
    }));
  }, [data]);

  const revenuePieData = useMemo(() => {
    const grouped: Record<string, number> = {};
    data.forEach((item) => {
      grouped[item.platform] = (grouped[item.platform] || 0) + item.netRevenue;
    });
    return Object.keys(grouped).map((platform) => ({
      name: platform,
      value: grouped[platform],
      percent: totalRevenue ? (grouped[platform] / totalRevenue) * 100 : 0,
    }));
  }, [data]);



  // Line chart data
  const lineData = useMemo(() => {
    const grouped: Record<string, { spend: number; revenue: number }> = {};
    data.forEach((item) => {
      if (!grouped[item.date]) grouped[item.date] = { spend: 0, revenue: 0 };
      grouped[item.date].spend += item.spendActual;
      grouped[item.date].revenue += item.netRevenue;
    });
    return Object.entries(grouped)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  // compute domain (min/max) for Y axis using both spend & revenue so both series fit same scale
  const { minY, maxY, ticks } = useMemo(() => {
    if (!lineData.length) return { minY: 0, maxY: 0, ticks: [0] };
    const allVals = lineData.flatMap((d) => [d.spend || 0, d.revenue || 0]);
    const max = Math.max(...allVals);
    const min = Math.min(...allVals, 0);
    const pad = Math.max(1, Math.round((max - min) * 0.06)); // 6% padding
    const domainMin = Math.max(0, Math.floor(min - pad));
    const domainMax = Math.ceil(max + pad);
    return { minY: domainMin, maxY: domainMax, ticks: getTicks(domainMin, domainMax, 5) };
  }, [lineData]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll to right (latest data) when lineData changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // slight timeout to ensure inner content width calculated
    requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    });
  }, [lineData.length]);

  // If you set a fixed max width for the visible area:
  // .line-scroll-container { max-width: 1200px; } in CSS (keeps Y axis visible on the left)
  return (
    <div className={cx("ads-charts-main")}>
      {/* Pie Charts */}
      <div className={cx("chart-box")}>
        <h4>Platform Share</h4>
        <div className={cx("pie-row")}>
          <div className={cx('pie1')}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={spendPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${(value ?? 0).toLocaleString("vi-VN")} (${((value ?? 0) / totalSpend * 100).toFixed(1)}%)`}
                  
                >
                  {spendPieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={cx('pie2')}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={revenuePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${(value ?? 0).toLocaleString("vi-VN")} ( ${( (value ?? 0) / totalRevenue * 100).toFixed(1)}% )`}
                >
                  {revenuePieData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={cx("pie-labels")}>
          <span>💸 Spend</span>
          <span>💰 Revenue</span>
        </div>
      </div>

      {/* Line Chart with scroll-X */}
      <div className={cx("chart-box2")}>
        <h4>Daily Spend & Revenue Trend</h4>

        <div className={cx("line-chart-wrapper")}>
          {/* LEFT: fixed Y axis */}
          <div className={cx("y-axis-fixed")}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <YAxis domain={[minY, maxY]} ticks={ticks} tickFormatter={(v) => v.toLocaleString("vi-VN")} width={80} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* RIGHT: scrollable chart area (no visible Y axis here) */}
          <div className={cx("line-scroll-container")} ref={scrollRef}>
            <div style={{ width: Math.max(lineData.length * 50, 800), height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" interval={0} angle={-30} textAnchor="end" height={60} />
                  {/* Hide Y axis here because left column displays it */}
                  <YAxis hide domain={[minY, maxY]} ticks={ticks} />
                  <Tooltip formatter={(value: any) => value.toLocaleString("vi-VN")} />
                  <Legend />
                  <Line type="monotone" dataKey="spend" stroke="#FF4D4F" name="Spend" dot={false} />
                  <Line type="monotone" dataKey="revenue" stroke="#52C41A" name="Revenue" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
