import React from "react";
import classNames from "classnames/bind";
import styles from "./StaffMenu.module.scss";
const cx = classNames.bind(styles);
import { useNavigate } from "react-router-dom";

import { MdDashboard, MdInventory, MdLocalShipping } from "react-icons/md";
import { FaMoneyBillWave, FaFileInvoiceDollar, FaUserTie, FaAd } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaStore } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { IoLogOutOutline } from "react-icons/io5";
import shoppingCart from "./icons/shopping-cart.gif";
import { IoMdCart } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import { FaCartPlus } from "react-icons/fa";
import { TbArrowBarLeft } from "react-icons/tb";
import { TbArrowBarRight } from "react-icons/tb";
import { ListProduct_Route, ListOrder_Route } from "../../configs/api";
import { useMenuStore } from "../StateManagement/MenuActiveState"; // ✅ import zustand store
import { useAuthStore } from "../../zustand/authStore";

import { useStaffMenuStore } from "../../zustand/menuCollapsed";
export default function StaffMenu() {
  const navigate = useNavigate();
  const { openMenu, activeSubmenu, setOpenMenu, setActiveSubmenu, menuCollapsed, toggleMenuCollapse } = useStaffMenuStore();

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // redirect
  };

  return (
    <div className={cx("main-menu", { collapsed: menuCollapsed })}>
      <div className={cx("part-above")}>
        <div className={cx("menu-item", { active: openMenu === "message" })} onClick={() => setOpenMenu("message")}>
          <div className={cx("part1")}>
            <AiFillMessage className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Tin nhắn</span>}
          </div>
        </div>
        <div
          className={cx("menu-item", { active: openMenu === "orders" })}
          onClick={() => {
            setOpenMenu("orders");
            window.open(ListOrder_Route, "_blank");
          }}
        >
          <div className={cx("part1")}>
            <FaCartPlus className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Đơn hàng</span>}
          </div>
        </div>
        <div
          className={cx("menu-item", { active: openMenu === "inventory" })}
          onClick={() => {
            setOpenMenu("inventory");
            window.open(ListProduct_Route, "_blank");
          }}
        >
          <div className={cx("part1")}>
            <MdInventory className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Kho hàng</span>}
          </div>
        </div>
      </div>

      <div className={cx("part-below")}>
        <div className={cx("menu-item")} onClick={toggleMenuCollapse}>
          <div className={cx("part1")}>
            <TbArrowBarLeft className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Thu nhỏ</span>}
          </div>
        </div>
        <div className={cx("menu-item")} onClick={handleLogout}>
          <div className={cx("part1")}>
            <IoLogOutOutline className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Đăng xuất</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
