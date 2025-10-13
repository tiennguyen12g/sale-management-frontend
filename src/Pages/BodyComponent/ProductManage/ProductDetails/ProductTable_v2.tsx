import React, { useState, useEffect, memo } from "react";
import classNames from "classnames/bind";
import styles from "./ProductTable_v2.module.scss";

const cx = classNames.bind(styles);
import { type ProductType, type ProductDetailsType } from "../../../../zustand/productStore";
import { useProductStore } from "../../../../zustand/productStore";
import NotificationBox_v2 from "../../../../ultilitis/NotificationBox_v2";
import { NavLink } from "react-router-dom";
import StaffTracking from "../../../../LandingOrders/StaffTracking";
import { useAuthStore } from "../../../../zustand/authStore";
import { useStaffStore } from "../../../../zustand/staffStore";
interface Props {
  // productName: string
}

function ProductTable_v2() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { products, fetchProducts } = useProductStore();
  // const startAutoFetch = useProductStore((s) => s.startAutoFetch);
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const {logout} = useAuthStore();
  const {staffID} = useStaffStore()

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  useEffect(() => {
    const timer = setInterval(() => {
      fetchProducts();
      console.log('fetch');
    }, 60 * 1000);

    return () => clearInterval(timer); // ✅ return a cleanup function
  }, []);

  useEffect(() => {
   async function GetData(){
    const res = await fetchProducts();
   if(res && res.status === "No valid token"){
    setStatusMsg(res.message);
    
   }
   if(res && res.status === "failed" ){
        setStatusMsg(res.message)
   }
   setShowNotification(true)
   }
   GetData();
  }, [fetchProducts]);

  // const product = products.filter((p) => p.name === productName);
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <div className={cx("product-table")}>
      {showNotification && statusMsg && <NotificationBox_v2 message={statusMsg} onClose={() => setShowNotification(false)}/>}
      
            <div className={cx("user-page")}>
        {staffID && <StaffTracking staffID={staffID} />}
        <NavLink key="user-page" to={`/ho-so-ca-nhan`} style={{ textDecoration: "none" }}>
          {/* {user?.email || "None"} */}
          Hồ sơ cá nhân
        </NavLink>
        <div onClick={() => handleLogout()}>Đăng xuất</div>
      </div>
      <h3>Danh sách sản phẩm đang bán</h3>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Mã SP</th>
            <th>Tên SP</th>
            <th>Loại</th>
            <th>Hàng trong kho</th>
            <th>Size có sẵn</th>
            <th>Màu có sẵn</th>
            <th>Ảnh</th>
            {/* <th style={{width: 190}}>Action</th> */}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 &&
            products.map((p, i) => {
              const totalItem = p.productDetailed.reduce((acc, item) => {
                acc += item.stock;
                return acc;
              }, 0);
              return (
                <React.Fragment key={p.productId}>
                  <tr onClick={() => toggleExpand(p.productId)}>
                    <td>{i + 1}</td>
                    <td>{p.productId}</td>
                    <td>{p.name}</td>
                    <td>{p.typeProduct || "-"}</td>
                    <td>{totalItem}</td>
                    <td>{p.sizeAvailable.join(", ")}</td>
                    <td>{p.colorAvailable.join(", ")}</td>
                    <td>
                      {p.imageUrl.map((img, i) => (
                        <img key={i} src={img.url} alt={img.name} style={{ width: "40px", height: "40px", marginRight: "4px" }} />
                      ))}
                    </td>
                    {/* <td>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(p); }}>✏️ Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(p.productId); }}>🗑 Delete</button>
                </td> */}
                  </tr>
                  {expandedId === p.productId && (
                    <tr className={cx("details-row")}>
                      <td colSpan={8}>
                        <div className={cx("details-box")}>
                          <h4>Chi tiết sản phẩm</h4>
                          <table className={cx("details-table")}>
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Tên</th>
                                <th>Màu</th>
                                <th>Size</th>
                                <th>Số lượng</th>
                                <th>Giá (VND)</th>
                                <th>Trọng lượng (g)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {p.productDetailed.map((d, idx) => (
                                <tr key={idx}>
                                  <td>{idx + 1}</td>
                                  <td>{d.name}</td>
                                  <td>{d.color}</td>
                                  <td>{d.size}</td>
                                  <td>{d.stock}</td>
                                  <td>{d.price.toLocaleString()}</td>
                                  <td>{d.weight}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable_v2;
