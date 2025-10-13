// src/components/pages/ImportExport/sections/InventorySection.tsx
import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ImportExportInventort_v2.module.scss";
const cx = classNames.bind(styles);
import AddManualForm from "./AddManualForm";
import InventoryTable from "./InventoryTable";
import type { InventoryRecord } from "../../../../zustand/importExportStore";
import ProductDetailsInventory from "../ProductDetails/ProductDetailsInventory";

interface Props {
  data: InventoryRecord[];
  onEdit: (item: InventoryRecord) => void;
  onDelete: (id: string) => void;
}

export default function InventorySection({}: Props) {
  const [showManual, setShowManual] = useState(false);
  const [showForm, setShowForm] = useState(false);
  return (
    <section className={cx("section")}>
      <div className={cx("actions")}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>📦 Inventory</div>
        <button className={cx("btn-decor", "btn-add")} onClick={() => setShowForm(true)}>
          + Thêm sản phẩm
        </button>
        {/* <div>
          <button onClick={() => setShowManual(true)}>➕ Add Manual</button>
        </div> */}
      </div>

      {/* <InventoryTable data={data} onEdit={onEdit} onDelete={onDelete} /> */}
      <ProductDetailsInventory showForm={showForm} setShowForm={setShowForm} />

      {showManual && <AddManualForm type="inventory" onClose={() => setShowManual(false)} onSave={(val) => console.log(val)} />}
    </section>
  );
}
