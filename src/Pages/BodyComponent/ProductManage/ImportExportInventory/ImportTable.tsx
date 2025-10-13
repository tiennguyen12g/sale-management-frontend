import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ImportTable.module.scss";
const cx = classNames.bind(styles);
import { MdEdit, MdDelete } from "react-icons/md";

import useFilterAndPagination from "./useFilterAndPagination";
import type { ImportRecord, ExportRecord, OtherFeesType } from "../../../../zustand/importExportStore";
import { useImportExportStore } from "../../../../zustand/importExportStore";
import EditImportForm from "./EditImportForm";
import { Tooltip } from "react-tooltip";
interface Props {
  data: ImportRecord[];
}

export default function ImportTable({ data }: Props) {
  const { updateRecord, deleteRecord } = useImportExportStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<ImportRecord | null>(null);
  const [showEditBox, setShowEditBox] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
  const handleDelete = async (id: string) => {
    let userConfirmed = window.confirm("Do you want to proceed?");
    // or simply:
    // let userConfirmed = confirm("Do you want to proceed?");

    if (userConfirmed) {
      console.log("User clicked OK.");
      const res = await deleteRecord("import", id);
    } else {
      console.log("User clicked Cancel.");
    }
  };
  const handleEdit = async () => {};

  const {
    filterMode,
    setFilterMode,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    years,
    productName,
    setProductName,
    batchCode,
    setBatchCode,
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
  } = useFilterAndPagination<ImportRecord>(data);

  return (
    <section>
      {/* Filters */}
      <div className={cx("filter-group")}>
        <label>Filter Mode:</label>
        <button onClick={() => setFilterMode("month")}>By Month</button>
        <button onClick={() => setFilterMode("year")}>By Year</button>
        <button onClick={() => setFilterMode("all")}>All Time</button>

        {filterMode === "month" && (
          <>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </>
        )}

        {filterMode === "year" && (
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}

        <input type="text" placeholder="Filter by product..." value={productName} onChange={(e) => setProductName(e.target.value)} />
        <input type="text" placeholder="Filter by Batch Code" value={batchCode} onChange={(e) => setBatchCode(e.target.value)} />
      </div>

      {/* Table */}
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Batch Code</th>
            <th>Product ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Broken</th>
            <th>Add Warehouse</th>
            <th>Shipment Value</th>
            <th>Shipping Fee</th>
            <th>Other Fees</th>
            <th>Total Cost</th>
            {/* <th>Break-even Price</th> */}
            <th>Warehouse Place</th>
            <th>Supplier</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, i) => {
            const shippingFee = item.shippingFee.externalChinaToVietnam + item.shippingFee.internalVietnamToWarehouse;
            const otherFee = item.otherFees.reduce((acc: number, f: OtherFeesType) => acc + f.value, 0);
            const totalCost = shippingFee + otherFee + item.importQuantity * item.pricePerUnit;
            const rawValue = totalCost / Math.max(1, item.importQuantity - item.brokenQuantity);
            const breakEvenPrice = Math.ceil(rawValue * 2) / 2;

            // Calculate extracly break-even price.
            

            return (
              <React.Fragment key={i}>
                <tr onClick={() => toggleExpand(item.batchCode)} style={{backgroundColor: item.batchCode === expandedId ? "#c3ecff" : ""}}>
                  <td>{new Date(item.time).toLocaleDateString()}</td>
                  <td>{item.batchCode || "-"}</td>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>{item.importQuantity}</td>
                  <td>{item.brokenQuantity}</td>
                  <td>{item.importQuantity - item.brokenQuantity}</td>
                  
                  {/* <td>{item.pricePerUnit.toLocaleString("vi-VN")} ₫</td> */}
                  <td>{item.totalShipment.toLocaleString("vi-VN")} ₫</td>
                  <td>{shippingFee.toLocaleString("vi-VN")} ₫</td>
                  <td data-tooltip-id={`other-fee${i}`}>{otherFee.toLocaleString("vi-VN")} ₫</td>
                  <td>{item.totalCost.toLocaleString("vi-VN")} ₫</td>
                  {/* <td>{item.breakEvenPrice.toLocaleString("vi-VN")} ₫</td> */}
                  <td>{item.warehouseName}</td>
                  <td>{item.supplier || "-"}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingData(item);
                        setShowEditBox(true);
                      }}
                    >
                      <MdEdit size={20} />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(item._id)}>
                      <MdDelete size={20} color="red" />
                    </button>
                  </td>
                </tr>
                {expandedId === item.batchCode && (
                  <tr className={cx("details-row")} >
                    <td colSpan={16}>
                      <div className={cx("details-box")}>
                        <h4>Chi tiết sản phẩm (Giá hòa nhập là chỉ tính tiền nhập hàng và các chi phí liên quan nhập hàng)</h4>
                        <table className={cx("details-table")}>
                          <thead>
                            <tr>
                              <th>No</th>
                              <th>Tên</th>
                              <th>Màu</th>
                              <th>Size</th>
                              <th>Nhập vào</th>
                              <th>Hỏng</th>
                              <th>Nhập kho</th>
                              {/* <th>Số lượng</th> */}
                              <th>Giá nhập(VND)</th>
                              <th>Giá hòa nhập(VND)</th>
                              <th>Trọng lượng (g)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.importDetails.map((d, idx) => {
                              const initialPercent = (d.importQuantity * d.price) / item.totalShipment;
                              const breakEvenPrice =  (item.totalCost * initialPercent) / d.importQuantity;
                              const breakEvenPriceFix = Math.ceil(breakEvenPrice / 1000) * 1000;

                              return(
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{d.name}</td>
                                <td>{d.color}</td>
                                <td>{d.size}</td>
                                <td>{d.importQuantity}</td>
                                <td>{d.brokenQuantity}</td>
                                <td>{d.addStock}</td>
                                <td>{d.price.toLocaleString("vi-VN")}₫</td>
                                <td>{breakEvenPriceFix.toLocaleString("vi-VN")}₫</td>
                                <td>{d.weight}</td>
                              </tr>
                            )
                            })}
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
      {/* ✅ Render all tooltips outside the table */}
      {paginatedData.map((item, i) => (
        <Tooltip id={`other-fee${i}`} key={i} place="top">
          <div>
            {item.otherFees.map((feeInfo, k) => (
              <div key={k} style={{ display: "flex", gap: 10, minWidth: 400 }}>
                <span>Date: {feeInfo.date}</span>
                <span style={{ flex: 0.6 }}>Value: {feeInfo.value}</span>
                <span style={{ flex: 1 }}>Used for: {feeInfo.usedFor}</span>
              </div>
            ))}
          </div>
        </Tooltip>
      ))}

      {/* Pagination */}
      <div className={cx("pagination")}>
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      {showEditBox && editingData && <EditImportForm onClose={() => setShowEditBox(false)} open={showEditBox} editData={editingData} />}
    </section>
  );
}
