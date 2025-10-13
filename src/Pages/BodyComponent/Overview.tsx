import React from "react";
import classNames from "classnames/bind";
import styles from "./OverView.module.scss";

import { MoneyInOutCards } from "./Financial/MoneyInOut/MoneyInOut";
import { OperatingCostsCards } from "./Financial/OperatingCosts/OperatingCosts";
import { StaffSalaryCards } from "./Financial/Staff/StaffSalery";
import { AdsCostsCards } from "./Financial/AdsCosts/AdsCosts";
import ProductSummaryTable from "./ProductManage/DeliveryReturnBroken/ProductSummaryTable";
import ProfitTable from "./Dashboard/ProfitTable";
const cx = classNames.bind(styles);

export default function Overview() {
  return (
    <div className={cx("overview-main")}>
      <div className={cx("title")}>📊 Dashboard Overview</div>
      <section className={cx("section")}>
        <ProfitTable />
      </section>

      {/* Money In/Out */}
      <section className={cx("section-1")}>
        <div className={cx("component-container")}>
          <h3>💰 Money In/Out</h3>
          <div>
            <MoneyInOutCards />
          </div>
        </div>
      </section>

      {/* Operating Costs */}
      <section className={cx("section-2")}>
        <div className={cx("component-container")}>
          <h3>👨‍💼 Staff Salary</h3>
          <div>
            <StaffSalaryCards />
          </div>
        </div>
        <div className={cx("component-container2")}>
          <h3>⚡ Operating Costs</h3>
          <div>
            <OperatingCostsCards />
          </div>
        </div>
      </section>

      {/* Staff Salary */}
      {/* <section className={cx("section")}>
        <h3>👨‍💼 Staff Salary</h3>
        <StaffSalaryCards />
      </section> */}

      {/* Advertising Costs */}
      <section className={cx("section-3")}>
        <h3>📢 Advertising Costs</h3>
        <AdsCostsCards />
      </section>
      <section className={cx("section")}>
        <ProductSummaryTable />
      </section>
      {/* <div style="position: absolute;right: 10px;bottom: 10;opacity: 1;display: flex">
        <div style="font-size: 16px; border-bottom: 5px solid black; width: 15px;rotate: 90deg;"></div>
        <div style="font-size: 16px; border-bottom: 5px solid black; width: 15px;rotate: 90deg;"></div>
        <div style="font-size: 16px; border-bottom: 5px solid black; width: 15px;rotate: 90deg;"></div>
        <div style="font-size: 16px; border-bottom: 5px solid black; width: 15px;rotate: 90deg;"></div>
      </div> */}
    </div>
  );
}
