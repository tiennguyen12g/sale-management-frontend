import React, { useState } from "react";
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
import { FaUserCircle } from "react-icons/fa";
import StaffTracking from "../../LandingOrders/StaffTracking";
import StaffTracking_v2 from "../../LandingOrders/StaffTracking_v2";
import { useStaffMenuStore } from "../../zustand/menuCollapsed";
import { useStaffStore } from "../../zustand/staffStore";
export default function StaffMenu() {
  const navigate = useNavigate();
  const { openMenu, activeSubmenu, setOpenMenu, setActiveSubmenu, menuCollapsed, toggleMenuCollapse } = useStaffMenuStore();
  const { staffID } = useStaffStore();
  const [staffActiveStatus, setStaffActiveStatus] = useState<string | null>(null);

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // redirect
  };

  return (
    <div className={cx("main-menu", { collapsed: menuCollapsed })}>

      {/* <div className={cx('part-avatar')}>
        <img src={fb_avatar} className={cx('img-avatar')}/>
      </div> */}
      <div className={cx("part-above")}>
        <div
          className={cx("menu-item", { active: openMenu === "message" })}
          onClick={() => {
            setOpenMenu("message");
            navigate("/tin-nhan-page");
          }}
        >
          <div className={cx("part1")}>
            <AiFillMessage className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Tin nhắn</span>}
          </div>
        </div>
        <div
          className={cx("menu-item", { active: openMenu === "orders" })}
          onClick={() => {
            setOpenMenu("orders");
            // window.open(ListOrder_Route, "_blank");
            navigate("/quan-li-don-hang");
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
            // window.open(ListProduct_Route, "_blank");
            navigate("/danh-sach-san-pham");
          }}
        >
          <div className={cx("part1")}>
            <MdInventory className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Kho hàng</span>}
          </div>
        </div>
        <div
          className={cx("menu-item", { active: openMenu === "user-page" })}
          onClick={() => {
            setOpenMenu("user-page");
            // window.open(ListProduct_Route, "_blank");
            navigate("/ho-so-ca-nhan");
          }}
        >
          <div className={cx("part1")}>
            <FaUserCircle className={cx("icon")} size={20} />
            {!menuCollapsed && <span>Hồ sơ</span>}
          </div>
        </div>
      </div>

      <div className={cx("part-below")}>
        <div className={cx("menu-item")} onClick={toggleMenuCollapse}>
          <div className={cx("part1")}>
            <StaffTracking_v2 staffID={staffID ? staffID : ""} menuCollapsed={menuCollapsed} />
          </div>
        </div>
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
const fb_avatar = "https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-6/518163607_122112329870925570_3189166168050201309_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=-JD2IryabeYQ7kNvwEFM9sf&_nc_oc=AdmLf0A6Ubz3mGZ1IIi0OOxWRusDD9FHgaY2E8g3BO2bTDjOpPvyLLfkeJIlCwF7vRA&_nc_zt=23&_nc_ht=scontent.fhan5-2.fna&_nc_gid=Zja_K_2-S9V9hhYn-Paf0A&oh=00_Afd_qJ1P8uTv0Z4_DKlrf2QwIs5fACgazvY72qPi4lYxmw&oe=68F59CA5"