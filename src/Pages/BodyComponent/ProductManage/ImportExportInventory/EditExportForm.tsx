import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./EditExportForm.module.scss";
import type { ImportType, OtherFeesType, ExportType } from "./Dataset/ImportExportInventoryType"

const cx = classNames.bind(styles);

interface Props {
  data: ExportType;
  onClose: () => void;
  onSave: (updated: ExportType) => void;
}

export default function EditExportForm({ data, onClose, onSave }: Props) {
  const [form, setForm] = useState<ExportType>({ ...data });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "exportQuantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={cx("modal-overlay")}>
      <div className={cx("modal")}>
        <h2>Edit Export Record</h2>
        <form onSubmit={handleSubmit} className={cx("form")}>
          <label>
            Product Name:
            <input
              type="text"
              name="productName"
              value={form.productName}
              onChange={handleChange}
            />
          </label>

          <label>
            Export Quantity:
            <input
              type="number"
              name="exportQuantity"
              value={form.exportQuantity}
              onChange={handleChange}
            />
          </label>

          <label>
            Receiver:
            <input
              type="text"
              name="receiver"
              value={form.receiver}
              onChange={handleChange}
            />
          </label>

          <label>
            Note:
            <textarea
              name="note"
              value={form.note ?? ""}
              onChange={handleChange}
            />
          </label>

          <div className={cx("actions")}>
            <button type="button" onClick={onClose} className={cx("cancel")}>
              Cancel
            </button>
            <button type="submit" className={cx("save")}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
