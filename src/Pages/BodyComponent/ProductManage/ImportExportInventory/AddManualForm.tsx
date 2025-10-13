import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AddManualForm.module.scss";

const cx = classNames.bind(styles);

interface Props {
  type: "import" | "export" | "inventory";
  onClose: () => void;
  onSave: (data: any, type: "import" | "export" | "inventory") => void;
}

export default function AddManualForm({ type, onClose, onSave }: Props) {
  const [form, setForm] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form, type);
  };

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-content")}>
        <h3>Add {type.toUpperCase()} Manually</h3>

        {type === "import" && (
          <>
            <input placeholder="Time" onChange={(e) => handleChange("time", e.target.value)} />
            <input placeholder="Product Name" onChange={(e) => handleChange("productName", e.target.value)} />
            <input type="number" placeholder="Quantity" onChange={(e) => handleChange("importQuantity", Number(e.target.value))} />
            <input type="number" placeholder="Broken Quantity" onChange={(e) => handleChange("brokenQuantity", Number(e.target.value))} />
            <input type="number" placeholder="Price per Unit" onChange={(e) => handleChange("pricePerUnit", Number(e.target.value))} />
            <input placeholder="Supplier" onChange={(e) => handleChange("supplier", e.target.value)} />
            <input placeholder="Batch Code" onChange={(e) => handleChange("batchCode", e.target.value)} />
          </>
        )}

        {type === "export" && (
          <>
            <input placeholder="Time" onChange={(e) => handleChange("time", e.target.value)} />
            <input placeholder="Product Name" onChange={(e) => handleChange("productName", e.target.value)} />
            <input type="number" placeholder="Export Quantity" onChange={(e) => handleChange("exportQuantity", Number(e.target.value))} />
            <input placeholder="Receiver" onChange={(e) => handleChange("receiver", e.target.value)} />
          </>
        )}

        {type === "inventory" && (
          <>
            <input placeholder="Product Name" onChange={(e) => handleChange("productName", e.target.value)} />
            <input type="number" placeholder="Current Stock" onChange={(e) => handleChange("currentStock", Number(e.target.value))} />
            <input type="number" placeholder="Average Cost" onChange={(e) => handleChange("averageCost", Number(e.target.value))} />
            <input placeholder="Warehouse Location" onChange={(e) => handleChange("warehouseLocation", e.target.value)} />
          </>
        )}

        <div className={cx("actions")}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
