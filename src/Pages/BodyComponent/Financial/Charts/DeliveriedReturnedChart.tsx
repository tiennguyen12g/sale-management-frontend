import { useMemo, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import classNames from "classnames/bind";
import styles from "./DeliveriedReturnedChart.module.scss";
const cx = classNames.bind(styles);

import { useAdsCostStore } from "../../../../zustand/adsCostStore";
import type { AdsCostType } from "../DataTest/AdsCostsData";
// nhớ là trong adsCostsData bạn phải có deliveried và returned


type Row = {
  month: string;
  // base = delivered - returned (so base + returned = real delivered)
  TikTokBase: number;
  TikTokReturned: number;
  FacebookBase: number;
  FacebookReturned: number;
  ShopeeBase: number;
  ShopeeReturned: number;
};

function fmt(v: number) {
  return v.toLocaleString("vi-VN");
}

// Custom tooltip: show real Delivered and Returned per platform
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  

  // payload is array of bars for this x (each bar has dataKey)
  // We'll extract base and returned per platform
  const getVal = (key: string) => {
    const p = payload.find((x: any) => x.dataKey === key);
    return p ? (p.value ?? 0) : 0;
  };

  const platforms = ["TikTok", "Facebook", "Shopee"];
  return (
    <div className={cx("custom-tooltip")}>
      <div className={cx("tooltip-label")}>{label}</div>
      {platforms.map((pl) => {
        const base = getVal(`${pl}Base`);
        const ret = getVal(`${pl}Returned`);
        const deliveredTotal = (base || 0) + (ret || 0);
        return (
          <div key={pl} className={cx("tooltip-row")}>
            <div className={cx("tooltip-pl")}>{pl}</div>
            <div className={cx("tooltip-values")}>
              <div className={cx("tooltip-del")}>Delivered: <b>{fmt(deliveredTotal)}</b></div>
              <div className={cx("tooltip-ret")}>Returned: <b>{fmt(ret)}</b></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
type ChartItem = {
  key: string;
  month: string;
  platform: AdsCostType["platform"];
  delivered: number;
  returned: number;
};

const barSizeCustom = 15;
export default function DeliveriedReturnedChart() {
  // aggregate per month and platform; compute base = delivered - returned
  const { adsCosts} = useAdsCostStore();
  const chartData: Row[] = useMemo(() => {
    const agg: Record<string, Row> = {};

    adsCosts.forEach((it: AdsCostType) => {
      const month = it.date.slice(0, 7); // YYYY-MM
      if (!agg[month]) {
        agg[month] = {
          month,
          TikTokBase: 0,
          TikTokReturned: 0,
          FacebookBase: 0,
          FacebookReturned: 0,
          ShopeeBase: 0,
          ShopeeReturned: 0,
        };
      }

      // Add raw values first
      if (it.platform === "TikTok") {
        agg[month].TikTokBase += Math.max(0, (it.ordersDelivered || 0) - (it.ordersReturned || 0));
        agg[month].TikTokReturned += (it.ordersReturned || 0);
      } else if (it.platform === "Facebook") {
        agg[month].FacebookBase += Math.max(0, (it.ordersDelivered || 0) - (it.ordersReturned || 0));
        agg[month].FacebookReturned += (it.ordersReturned || 0);
      } else if (it.platform === "Shopee") {
        agg[month].ShopeeBase += Math.max(0, (it.ordersDelivered || 0) - (it.ordersReturned || 0));
        agg[month].ShopeeReturned += (it.ordersReturned || 0);
      }
    });

    // ensure months sorted ascending
    return Object.values(agg).sort((a, b) => a.month.localeCompare(b.month));
  }, []);

  // scroll to right (latest) when data changes
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // scroll to right
    requestAnimationFrame(() => {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    });
  }, [chartData.length]);

  // dynamic minWidth per month (adjust per taste)
  const minWidth = Math.max(800, chartData.length * 220); // 220px per month (group of 3 stacked bars)

  return (
    <div className={cx("chart-box")}>
      <h3 className={cx("title")}>Delivered vs Returned</h3>

      <div className={cx("chart-scroll-container")} ref={scrollRef}>
        <div className={cx("chart-inner")} style={{ minWidth: `${minWidth}px`, height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 70, bottom: 80 }}
              barCategoryGap="30%"
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                interval={0}
                angle={0}
                textAnchor="end"
                height={60}
              />
              <YAxis tickFormatter={(v) => v.toLocaleString("vi-VN")} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* TikTok stack */}
                            <Bar dataKey="TikTokReturned" stackId="TikTok" fill="#ff6b6b" name="TikTok Returned" barSize={18} />
              <Bar dataKey="TikTokBase" stackId="TikTok" fill="#050505" name="TikTok Delivered (net)" barSize={18} />


              {/* Facebook stack */}
                            <Bar dataKey="FacebookReturned" stackId="Facebook" fill="#ffa94d" name="Facebook Returned" barSize={18} />
              <Bar dataKey="FacebookBase" stackId="Facebook" fill="#4287f5" name="Facebook Delivered (net)" barSize={18} />


              {/* Shopee stack */}
                 <Bar dataKey="ShopeeReturned" stackId="Shopee" fill="#3fdb6e" name="Shopee Returned" barSize={18} />
              <Bar dataKey="ShopeeBase" stackId="Shopee" fill="#f56a42" name="Shopee Delivered (net)" barSize={18} />
                         

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}