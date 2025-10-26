import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./NewLayoutTemplate.module.scss";
const cx = classNames.bind(styles);
const iconSize = 20;
import { LuSquareMenu } from "react-icons/lu";
export default function NewLayoutTemplate() {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  return (
    <div className={cx("main-layout")}>
      {/* Sidebar */}
      <div className={cx("body-left")} style={{ width: menuCollapsed ? 60 : 180 }}>
        <div className={cx("collapsed-btn")} onClick={() => setMenuCollapsed(!menuCollapsed)}>
          {/* {!menuCollapsed ? <IoIosArrowDropleft size={24} color="#ff3300" /> : <IoIosArrowDropright size={24} color="#ff3300" />} */}
        </div>
        <div className={cx("sidebar-header")}>
          <div className={cx("logo-section")}></div>
        </div>
        <div className={cx("sidebar-menu")}>
          <div className={cx("menu-title")}>
            <LuSquareMenu size={22} />
            {!menuCollapsed && <span> MENU ____________</span>}
          </div>
          <div className={cx("wrap-menu-item")}>
            {/* <div className={cx("menu-item", `${viewMode === "table" ? "active" : ""}`)} onClick={() => setViewMode("table")}>
              <div style={{ width: menuCollapsed ? "100%" : "" }}>
                {" "}
                <MdInsertChart size={iconSize + 2} />
              </div>
              {!menuCollapsed && <span>Xem đơn hàng</span>}
            </div>
            <div className={cx("menu-item", `${viewMode === "excel" ? "active" : ""}`)} onClick={() => setViewMode("excel")}>
              <div style={{ width: menuCollapsed ? "100%" : "" }}>
                <CgDesktop size={iconSize} />
              </div>
              {!menuCollapsed && <span>Tạo Excel</span>}
            </div> */}
          </div>
        </div>
        <div className={cx("sidebar-footer")}>
          <div className={cx("footer-info")}>{/* Footer content */}</div>
        </div>
      </div>

      {/* Body Content */}
      <div className={cx("body-right")} style={{ width: menuCollapsed ? "calc(100% - 60px)" : "calc(100% - 180px)" }}>
        <div className={cx("header")}>
          <div className={cx("header-left")}>
            <div className={cx("header-tabs")}></div>
          </div>
          <div className={cx("header-right")}>
            <div className={cx("header-actions")}></div>
          </div>
        </div>

        <div className={cx("header-left")}>
          <div className={cx("header-tabs")}></div>
        </div>
        <div className={cx("header-right")}></div>
        <div className={cx("content")}>
          <div className={cx("table-scroll")}>
            <div className={cx("table-container")}>
              <div className={cx("table-header")}></div>
              <div className={cx("table-body")}></div>
            </div>
          </div>
        </div>

        <div className={cx("footer")}></div>
      </div>
    </div>
  );
}
