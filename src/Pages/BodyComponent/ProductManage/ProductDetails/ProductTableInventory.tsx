import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProductTableInventory.module.scss";

const cx = classNames.bind(styles);
import { type ProductType, type ProductDetailsType } from "../../../../zustand/productStore";

interface Props {
  products: ProductType[];
  onEdit: (p: ProductType) => void;
  onDelete: (id: string) => void;
}

export default function ProductTableInventory({ products, onEdit, onDelete }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };


  return (
    <div className={cx("product-table")}>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Mã SP</th>
            <th>Tên SP</th>
            <th>Loại</th>
            <th>Hàng trong kho</th>
            <th>Giá trị vốn ước tính</th>
            <th>Doanh thu tiềm năng</th>
            <th>Size có sẵn</th>
            <th>Màu có sẵn</th>
            <th>Ảnh</th>
            <th style={{width: 190}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            const calculateObj = p.productDetailed.reduce((obj, item, i) => {
                obj.estRevenue += item.price * item.stock;
                obj.originValue += item.breakEvenPrice * item.stock;
                obj.totalItem += item.stock;
                return obj;
            }, {estRevenue: 0, originValue: 0, totalItem: 0});
            const fixRevenue = calculateObj.originValue ? Math.floor(calculateObj.estRevenue / 1000) * 1000 : 0;
            const fixOriginValue = calculateObj.estRevenue ? Math.floor(calculateObj.originValue / 1000) * 1000 : 0;
            return (
            <React.Fragment key={p.productId}>
              <tr onClick={() => toggleExpand(p.productId)}>
                <td>{i + 1}</td>
                <td>{p.productId}</td>
                <td>{p.name}</td>
                <td>{p.typeProduct || "-"}</td>
                <td>{calculateObj.totalItem}</td>
                <td>{ fixOriginValue.toLocaleString("vi-VN")}₫</td>
                <td>{ fixRevenue.toLocaleString("vi-VN")}₫</td>
                <td>{p.sizeAvailable.join(", ")}</td>
                <td>{p.colorAvailable.join(", ")}</td>
                <td>
                  {p.imageUrl.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.name}
                      style={{ width: "40px", height: "40px", marginRight: "4px" }}
                    />
                  ))}
                </td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(p); }}>✏️ Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(p._id); }}>🗑 Delete</button>
                </td>
              </tr>
              {expandedId === p.productId && (
                <tr className={cx("details-row")}>
                  <td colSpan={11}>
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
                            <th>Giá hòa nhập</th>
                            <th>Giá bán(VND)</th>
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
                              <td>{d.breakEvenPrice.toLocaleString() || 0} ₫</td>
                              <td>{d.price.toLocaleString()}₫</td>
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
          )
          })}
        </tbody>
      </table>
    </div>
  );
}
