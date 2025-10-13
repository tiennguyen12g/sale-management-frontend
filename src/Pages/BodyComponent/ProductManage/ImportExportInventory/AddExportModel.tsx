import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AddImportModel.module.scss";
const cx = classNames.bind(styles);
import { useImportExportStore } from "../../../../zustand/importExportStore";
import type { ImportRecord } from "../../../../zustand/importExportStore";
export interface AddExportForm {
  time: string;
  productId: string;
  productName: string;
  exportQuantity: number;
  receiver: string;

  note?: string;
  batchCode?: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  importData: ImportRecord[]
  defaultValues?: Partial<AddExportForm>;
};

const localTime = new Date().toISOString().slice(0, 10);

export default function AddExportModel({ open, onClose, defaultValues = {}, importData }: Props) {
  const { addRecord } = useImportExportStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AddExportForm>({
    time: defaultValues.time ?? new Date().toISOString().slice(0, 10),
    productId: defaultValues.productId ?? "",
    productName: defaultValues.productName ?? "",
    exportQuantity: defaultValues.exportQuantity ?? 0,
    receiver: defaultValues.receiver ?? "",
    note: defaultValues.note ?? "",
  });

  // Keep form in sync when modal opens with different defaults
  React.useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        time: defaultValues.time ?? new Date().toISOString().slice(0, 10),
        productId: defaultValues.productId ?? f.productId,
        productName: defaultValues.productName ?? f.productName,
        exportQuantity: defaultValues.exportQuantity ?? f.exportQuantity,
        receiver: defaultValues.receiver ?? f.receiver,
        note: defaultValues.note ?? f.note,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleChange = (k: keyof AddExportForm, v: string | number) => {
    setForm((s) => ({ ...s, [k]: typeof v === "string" && k === "exportQuantity" ? Number(v) : v } as AddExportForm));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    console.log("hee");
    e?.preventDefault();
    if (!form.productId || !form.productName || !form.exportQuantity || !form.receiver) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await addRecord("export", {
        time: form.time,
        productId: form.productId,
        productName: form.productName,
        exportQuantity: form.exportQuantity,
        receiver: form.receiver,

        note: form.note || "",
        batchCode: "",
      });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Add import failed", err);
      setLoading(false);
      alert("Failed to add import");
    }
  };


  return (
    <div className={cx("modal-backdrop")} role="dialog" aria-modal="true" aria-label="Add import record">
      <div className={cx("modal-box")}>
        <header className={cx("modal-header")}>
          <h3>Add Export Record</h3>
          <button className={cx("modal-close")} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <form className={cx("modal-form")} onSubmit={handleSubmit}>
          <label>
            Product name
            {/* <input type="text" value={form.productName} onChange={(e) => handleChange("productName", e.target.value)} required /> */}
            <select>
              
            </select>
          </label>
          <label>
            Product ID
            <input type="text" value={form.productId} onChange={(e) => handleChange("productId", e.target.value)} required />
          </label>

          <label>
            Quantity export
            <input type="number" min={0} value={String(form.exportQuantity)} onChange={(e) => handleChange("exportQuantity", Number(e.target.value))} />
          </label>



          <label>
            Date
            <input type="date" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />
          </label>


          <label>
            Batch code
            <input type="text" value={form.batchCode} onChange={(e) => handleChange("batchCode", e.target.value)} />
          </label>

          <label>
            Note
            <textarea value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
          </label>
        </form>

        <div className={cx("modal-actions")}>
          <button type="button" className={cx("btn-secondary")} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className={cx("btn-primary")} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
