import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AddImportModel.module.scss";
const cx = classNames.bind(styles);
import { useImportExportStore } from "../../../../zustand/importExportStore";
import type { ImportRecord } from "../../../../zustand/importExportStore";
export interface AddImportForm {
  time: string;
  productId: string;
  productName: string;
  importQuantity: number;
  addedQuantity: number;
  brokenQuantity: number;
  pricePerUnit: number;
  supplier?: string;
  batchCode?: string;
  note?: string;
  otherFee?: number;
  shippingFeeInternal?: number;
  shippingFeeExternal?: number;
  shipmentStatus: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  shipmentInfo: ImportRecord;
};

export default function EditImportModal({ open, onClose, shipmentInfo }: Props) {
  const addRecord = useImportExportStore((s) => s.addRecord);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AddImportForm>({
    time: shipmentInfo.time ?? new Date().toISOString().slice(0, 10),
    productId: shipmentInfo.productId ?? "",
    productName: shipmentInfo.productName ?? "",
    importQuantity: shipmentInfo.importQuantity ?? 1,
    addedQuantity: shipmentInfo.addedQuantity ?? 0,
    brokenQuantity: shipmentInfo.brokenQuantity ?? 0,
    pricePerUnit: shipmentInfo.pricePerUnit ?? 0,
    supplier: shipmentInfo.supplier ?? "",
    batchCode: shipmentInfo.batchCode ?? "",
    note: shipmentInfo.note ?? "",
    otherFee: shipmentInfo.otherFee ?? 0,
    shippingFeeInternal: shipmentInfo.shippingFee.internalVietnamToWarehouse ?? 0,
    shippingFeeExternal: shipmentInfo.shippingFeeExternal ?? 0,
    shipmentStatus: shipmentInfo.shipmentStatus ?? "On delivery",
  });

  // Keep form in sync when modal opens with different defaults
  React.useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        time: shipmentInfo.time ?? new Date().toISOString().slice(0, 10),
        productId: shipmentInfo.productId ?? f.productId,
        productName: shipmentInfo.productName ?? f.productName,
        importQuantity: shipmentInfo.importQuantity ?? f.importQuantity,
        addedQuantity: shipmentInfo.addedQuantity ?? f.addedQuantity,
        brokenQuantity: shipmentInfo.brokenQuantity ?? f.brokenQuantity,
        pricePerUnit: shipmentInfo.pricePerUnit ?? f.pricePerUnit,
        supplier: shipmentInfo.supplier ?? f.supplier,
        batchCode: shipmentInfo.batchCode ?? f.batchCode,
        note: shipmentInfo.note ?? f.note,
        otherFee: shipmentInfo.otherFee ?? f.otherFee,
        shippingFeeInternal: shipmentInfo.shippingFeeInternal ?? f.shippingFeeInternal,
        shippingFeeExternal: shipmentInfo.shippingFeeExternal ?? f.shippingFeeExternal,
        shipmentStatus: shipmentInfo.shipmentStatus ?? f.shipmentStatus,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleChange = (k: keyof AddImportForm, v: string | number) => {
    setForm(
      (s) =>
        ({ ...s, [k]: typeof v === "string" && (k === "importQuantity" || k === "brokenQuantity" || k === "pricePerUnit") ? Number(v) : v } as AddImportForm)
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.productId || !form.productName || !form.importQuantity || !form.pricePerUnit) {
      alert("Please fill all required fields");
      return;
    }
    const addedQuantity = form.importQuantity - form.brokenQuantity;
    const totalShippingFee = (form.shippingFeeExternal ?? 0) + (form.shippingFeeExternal ?? 0);

    const totalShipment = form.importQuantity * form.pricePerUnit;
    const totalCost = totalShipment + totalShippingFee + (form.otherFee ?? 0);
    const breakevenPrice = totalCost / addedQuantity;
    setLoading(true);

    try {
      await addRecord("import", {
        time: form.time,
        productId: form.productId,
        productName: form.productName,
        importQuantity: form.importQuantity,
        brokenQuantity: form.brokenQuantity,
        pricePerUnit: form.pricePerUnit,
        supplier: form.supplier,
        batchCode: form.batchCode,
        note: form.note,
        otheFee: form.otherFee,
        shippingFee: {
          externalChinaToVietnam: form.shippingFeeExternal || 0,
          internalVietnamToWarehouse: form.shippingFeeInternal || 0,
        },
        addedQuantity: addedQuantity,
        totalShipment,
        totalCost,
        breakEvenPrice: +breakevenPrice.toFixed(2),
        shipmentStatus: form.shipmentStatus,
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
          <h3>Add Import Record</h3>
          <button className={cx("modal-close")} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <form className={cx("modal-form")} onSubmit={handleSubmit}>
          <label>
            Product ID
            <input type="text" value={form.productId} onChange={(e) => handleChange("productId", e.target.value)} required />
          </label>

          <label>
            Product name
            <input type="text" value={form.productName} onChange={(e) => handleChange("productName", e.target.value)} required />
          </label>

          <label>
            Quantity imported
            <input type="number" min={0} value={String(form.importQuantity)} onChange={(e) => handleChange("importQuantity", Number(e.target.value))} />
          </label>

          <label>
            Broken quantity
            <input type="number" min={0} value={String(form.brokenQuantity)} onChange={(e) => handleChange("brokenQuantity", Number(e.target.value))} />
          </label>

          <label>
            <div>Price per unit: {form.pricePerUnit.toLocaleString("vi-VN")}₫</div>
            <input type="number" min={0} value={String(form.pricePerUnit)} onChange={(e) => handleChange("pricePerUnit", Number(e.target.value))} />
          </label>
          <label>
            <div>Other fee: {form.otherFee ? form.otherFee.toLocaleString("vi-VN") : 0}₫</div>
            <input type="number" min={0} value={String(form.otherFee)} onChange={(e) => handleChange("otherFee", Number(e.target.value))} />
          </label>
          <label>
            <div>Shipping fee in VietNam: {form.shippingFeeInternal ? form.shippingFeeInternal.toLocaleString("vi-VN") : 0}₫</div>
            <input
              type="number"
              min={0}
              value={String(form.shippingFeeInternal)}
              onChange={(e) => handleChange("shippingFeeInternal", Number(e.target.value))}
            />
          </label>
          <label>
            <div>Shipping fee in Oversea: {form.shippingFeeExternal ? form.shippingFeeExternal.toLocaleString("vi-VN") : 0}₫</div>
            <input
              type="number"
              min={0}
              value={String(form.shippingFeeExternal)}
              onChange={(e) => handleChange("shippingFeeExternal", Number(e.target.value))}
            />
          </label>
          <label>
            Date
            <input type="date" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />
          </label>
          <label>
            Shipment status
            <input type="text" min={0} value={String(form.shipmentStatus)} onChange={(e) => handleChange("shipmentStatus", Number(e.target.value))} />
          </label>

          <label>
            Supplier
            <input type="text" value={form.supplier} onChange={(e) => handleChange("supplier", e.target.value)} />
          </label>

          <label>
            Batch code
            <input type="text" value={form.batchCode} onChange={(e) => handleChange("batchCode", e.target.value)} />
          </label>

          <label>
            Note
            <textarea value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
          </label>

          <div className={cx("modal-actions")}>
            <button type="button" className={cx("btn-secondary")} onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={cx("btn-primary")} disabled={loading}>
              {loading ? "Saving..." : "Save Import"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
