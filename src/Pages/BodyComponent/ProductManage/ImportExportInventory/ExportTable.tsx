import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ExportTable.module.scss";
const cx = classNames.bind(styles);
import { MdEdit, MdDelete } from "react-icons/md";
import useFilterAndPagination from "./useFilterAndPagination";
import type { ImportRecord, ExportRecord, OtherFeesType } from "../../../../zustand/importExportStore";
import AddExportModel from "./AddExportModel";
import { useImportExportStore } from "../../../../zustand/importExportStore";
interface Props {
  data: ExportRecord[];
}

export default function ExportTable({ data }: Props) {
  const { updateRecord, deleteRecord } = useImportExportStore();
  const [editingData, setEditingData] = useState<ExportRecord | null>(null);
  const [showEditBox, setShowEditBox] = useState(false);
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
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
  } = useFilterAndPagination<ExportRecord>(data);

  const handleDelete = async (id: string) => {
    let userConfirmed = window.confirm("Do you want to proceed?");
    // or simply:
    // let userConfirmed = confirm("Do you want to proceed?");

    if (userConfirmed) {
      console.log("User clicked OK.");
      const res = await deleteRecord("export", id);
    } else {
      console.log("User clicked Cancel.");
    }
  };
  const handleEdit = async () => {};
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
      </div>

      {/* Table */}
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Product ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Receiver</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, i) => (
            <tr key={i}>
              <td>{new Date(item.time).toLocaleDateString()}</td>
              <td>{item.productId}</td>
              <td>{item.productName}</td>
              <td>{item.exportQuantity}</td>
              <td>{item.receiver}</td>
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
          ))}
        </tbody>
      </table>

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
      {/* {showEditBox && editingData && <EditImportForm onClose={() => setShowEditBox(false)} open={showEditBox} editData={editingData} />} */}
    </section>
  );
}
