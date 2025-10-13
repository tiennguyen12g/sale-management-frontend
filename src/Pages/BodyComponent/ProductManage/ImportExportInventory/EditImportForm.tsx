import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AddImportModel.module.scss";
const cx = classNames.bind(styles);
import { useImportExportStore, type ImportRecord, type ImportProductDetailsType, type OtherFeesType } from "../../../../zustand/importExportStore";
import { FaSquarePlus } from "react-icons/fa6";
import { BiSolidMinusSquare } from "react-icons/bi";
import { FaRegClone } from "react-icons/fa6";

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
  // otherFee?: number;
  shippingFeeInternal?: number;
  shippingFeeExternal?: number;
  shipmentStatus: string;
  warehouseName: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  editData: ImportRecord;
};

const localTime = new Date().toISOString().slice(0, 10);
const DefaultOtherFee = { value: 0, usedFor: "", date: localTime };
export default function EditImportForm({ open, onClose, editData }: Props) {
  const { addRecord, updateRecord } = useImportExportStore();
  const [sizeAvailable, setSizeAvailable] = useState<string[]>(editData.sizeAvailable || []);
  const [colorAvailable, setColorAvailable] = useState<string[]>(editData.colorAvailable || []);
  const [loading, setLoading] = useState(false);
  const [productDetails, setProductDetails] = useState<ImportProductDetailsType[]>(editData.importDetails);

  const defaultValues = editData;

  const [arrayOtherFees, setArrayOtherFees] = useState<OtherFeesType[]>(defaultValues.otherFees);
  const [form, setForm] = useState<AddImportForm>({
    time: defaultValues.time ?? new Date().toISOString().slice(0, 10),
    productId: defaultValues.productId ?? "",
    productName: defaultValues.productName ?? "",
    importQuantity: defaultValues.importQuantity ?? 1,
    addedQuantity: defaultValues.addedQuantity ?? 0,
    brokenQuantity: defaultValues.brokenQuantity ?? 0,
    pricePerUnit: defaultValues.pricePerUnit ?? 0,
    supplier: defaultValues.supplier ?? "",
    batchCode: defaultValues.batchCode ?? "",
    note: defaultValues.note ?? "",
    // otherFee: defaultValues.otherFee ?? 0,
    shippingFeeInternal: defaultValues.shippingFee.internalVietnamToWarehouse ?? 0,
    shippingFeeExternal: defaultValues.shippingFee.externalChinaToVietnam ?? 0,
    shipmentStatus: defaultValues.shipmentStatus ?? "On delivery",
    warehouseName: defaultValues.warehouseName ?? "",
  });

  // Keep form in sync when modal opens with different defaults
  React.useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        time: defaultValues.time ?? new Date().toISOString().slice(0, 10),
        productId: defaultValues.productId ?? f.productId,
        productName: defaultValues.productName ?? f.productName,
        importQuantity: defaultValues.importQuantity ?? f.importQuantity,
        addedQuantity: defaultValues.addedQuantity ?? f.addedQuantity,
        brokenQuantity: defaultValues.brokenQuantity ?? f.brokenQuantity,
        pricePerUnit: defaultValues.pricePerUnit ?? f.pricePerUnit,
        supplier: defaultValues.supplier ?? f.supplier,
        batchCode: defaultValues.batchCode ?? f.batchCode,
        note: defaultValues.note ?? f.note,
        // otherFee: defaultValues.otherFee ?? f.otherFee,
        shippingFeeInternal: defaultValues.shippingFee.internalVietnamToWarehouse ?? 0,
        shippingFeeExternal: defaultValues.shippingFee.externalChinaToVietnam ?? 0,
        shipmentStatus: defaultValues.shipmentStatus ?? f.shipmentStatus,
        warehouseName: defaultValues.warehouseName ?? f.warehouseName,
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
    console.log("hee");
    e?.preventDefault();
    if (!form.productId || !form.productName) {
      alert("Please fill all required fields");
      return;
    }
    const calculateQuantity = productDetails.reduce(
      (objQuantity, item) => {
        objQuantity.importQuantity += item.importQuantity;
        objQuantity.brokenQuantity += item.brokenQuantity;
        objQuantity.addStock += item.addStock;
        objQuantity.totalShipment += item.importQuantity * item.price;
        return objQuantity;
      },
      { importQuantity: 0, brokenQuantity: 0, addStock: 0, totalShipment: 0 }
    );

    const totalShippingFee = (form.shippingFeeExternal ?? 0) + (form.shippingFeeInternal ?? 0);
    const totalOtherFees = arrayOtherFees.reduce((acc, item) => {
      acc += +item.value;
      return acc;
    }, 0);

    const totalShipment = calculateQuantity.totalShipment;
    const totalCost = totalShipment + totalShippingFee + totalOtherFees;
    const breakevenPrice = totalCost / calculateQuantity.importQuantity;
    setLoading(true);

    try {
      const dataSend: Omit<ImportRecord, "_id"> = {
        time: form.time,
        productId: form.productId,
        productName: form.productName,
        importQuantity: calculateQuantity.importQuantity,
        brokenQuantity: calculateQuantity.brokenQuantity,
        addedQuantity: calculateQuantity.addStock,
        pricePerUnit: form.pricePerUnit,
        supplier: form.supplier,
        batchCode: form.batchCode,
        note: form.note,
        otherFees: arrayOtherFees,
        shippingFee: {
          externalChinaToVietnam: form.shippingFeeExternal || 0,
          internalVietnamToWarehouse: form.shippingFeeInternal || 0,
        },

        totalShipment,
        totalCost,
        breakEvenPrice: +breakevenPrice.toFixed(2),
        shipmentStatus: form.shipmentStatus,
        importDetails: productDetails,
        sizeAvailable: sizeAvailable,
        colorAvailable: colorAvailable,
        warehouseName: form.warehouseName,
      };
      await updateRecord("import", editData._id, dataSend);
      setLoading(false);
      onClose();
    } catch (err) {
      console.error("Add import failed", err);
      setLoading(false);
      alert("Failed to add import");
    }
  };

  // 🔹 Update a specific field in a specific fee
  const handleOtherFeeChange = (index: number, field: keyof typeof DefaultOtherFee, value: string | number) => {
    setArrayOtherFees((prev) =>
      prev.map((fee, i) =>
        i === index
          ? {
              ...fee,
              [field]: value,
            }
          : fee
      )
    );
  };

  // ---- PRODUCT DETAIL HANDLING ----
  const handleAddDetail = () => {
    setProductDetails((prev) => [...prev, { name: "", stock: 0, color: "", size: "", price: 0, weight: 0, importQuantity: 0, brokenQuantity: 0, addStock: 0 }]);
  };

  const handleDetailChange = (index: number, field: keyof ImportProductDetailsType, value: any) => {
    const newDetails = [...productDetails];
    (newDetails[index] as any)[field] = value;
    if (field === "importQuantity" || field === "brokenQuantity") {
      const importQuantity = newDetails[index].importQuantity;
      const brokenQuantity = newDetails[index].brokenQuantity;
      newDetails[index].addStock = importQuantity > brokenQuantity ? importQuantity - brokenQuantity : 0;
    }

    setProductDetails(newDetails);
  };

  // clone handler
  const handleCloneDetail = (idx: number) => {
    setProductDetails((prev) => {
      const copyDetails = [...prev];
      const clonedItem = { ...copyDetails[idx] };
      copyDetails.splice(idx + 1, 0, clonedItem);
      return copyDetails; // ✅ return just the new array
    });
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = [...productDetails];
    newDetails.splice(index, 1);
    setProductDetails(newDetails);
  };
  return (
    <div className={cx("modal-backdrop")} role="dialog" aria-modal="true" aria-label="Add import record">
      <div className={cx("modal-box")}>
        <header className={cx("modal-header")}>
          <h3>Editing Import Record</h3>
          <button className={cx("modal-close")} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <form className={cx("modal-form")} onSubmit={handleSubmit}>
          <label>
            Product name
            <input type="text" value={form.productName} onChange={(e) => handleChange("productName", e.target.value)} required />
          </label>
          <label>
            Product ID
            <input type="text" value={form.productId} onChange={(e) => handleChange("productId", e.target.value)} required />
          </label>

          {/* <label>
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
          </label> */}
          {/* <label>
            <div>Other fee: {form.otherFee ? form.otherFee.toLocaleString("vi-VN") : 0}₫</div>
            <input type="number" min={0} value={String(form.otherFee)} onChange={(e) => handleChange("otherFee", Number(e.target.value))} />
          </label> */}
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
            Warehouse name
            <input type="text" value={form.warehouseName} onChange={(e) => handleChange("warehouseName", e.target.value)} required />
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
            <input type="text" value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
          </label>
        </form>

        <div className={cx("form-group")}>
          <div className={cx("field")}>
            <label>
              Size Available: &nbsp;
              {sizeAvailable.map((size, i) => {
                return (
                  <span key={i} style={{ color: "red" }}>
                    {size} &nbsp;
                  </span>
                );
              })}
            </label>
            <input
              value={sizeAvailable}
              onChange={(e) => {
                const value = e.target.value.split(",").map((item) => item.trim());
                setSizeAvailable(value);
              }}
            />
            <div style={{ color: "gray" }}>Ví dụ: M, S, L, XL, XXL, XXXL or 20*30*40cm, 20*20*20cm ... cách nhau bằng dấu phẩy ","</div>
          </div>
        </div>
        <div className={cx("form-group")}>
          <div className={cx("field")}>
            <label>
              Color Available: &nbsp;
              {colorAvailable.map((color, i) => {
                return (
                  <span key={i} style={{ color: "red" }}>
                    {color} &nbsp;
                  </span>
                );
              })}
            </label>
            <input
              value={colorAvailable}
              onChange={(e) => {
                const value = e.target.value.split(",").map((item) => item.trim());
                setColorAvailable(value);
              }}
            />
            <div style={{ color: "gray" }}>Ví dụ: đỏ, xanh dương, xám, vàng, nâu, tím, mận đỏ ... cách nhau bằng dấu phẩy ","</div>
          </div>
        </div>
        {/* Product details list */}
        <div style={{ fontSize: 17, fontWeight: 550 }}>
          <span style={{ marginRight: 15 }}>Chi tiết sản phẩm</span>
          <button className={cx("btn-decor", "btn-add")} onClick={() => handleAddDetail()}>
            + Add more
          </button>
        </div>
        <div className={cx("detail-row")}>
          {/* <div>Name</div> */}
          <div>Color</div>
          <div>Size</div>
          <div>Imported</div>
          <div>Broken</div>
          <div>Add Stock</div>
          <div>Import Price</div>
          <div>Weight(gram)</div>
          <div>Clone</div>
          <div>Delete</div>
        </div>
        {productDetails.map((detail, idx) => (
          <div key={idx} className={cx("detail-row")}>
            {/* <input className={cx("input-name")} placeholder="Tên" value={detail.name} onChange={(e) => handleDetailChange(idx, "name", e.target.value)} /> */}

            <select value={detail.color} onChange={(e) => handleDetailChange(idx, "color", e.target.value)}>
              <option value="None">None</option>
              {colorAvailable.map((color, i) => {
                return (
                  <option key={i} value={color}>
                    {color}
                  </option>
                );
              })}
            </select>
            <select value={detail.size} onChange={(e) => handleDetailChange(idx, "size", e.target.value)}>
              <option value="None">None</option>
              {sizeAvailable.map((size, i) => {
                return (
                  <option key={i} value={size}>
                    {size}
                  </option>
                );
              })}
            </select>
            <input
              className={cx("input-quantity")}
              type="number"
              placeholder="Số lượng"
              value={detail.importQuantity}
              onChange={(e) => handleDetailChange(idx, "importQuantity", Number(e.target.value))}
            />
            <input
              className={cx("input-quantity")}
              type="number"
              placeholder="Số lượng"
              value={detail.brokenQuantity}
              onChange={(e) => handleDetailChange(idx, "brokenQuantity", Number(e.target.value))}
            />
            <input
              className={cx("input-quantity")}
              type="number"
              placeholder="Số lượng"
              value={detail.addStock}
              onChange={(e) => handleDetailChange(idx, "addStock", Number(e.target.value))}
              disabled
            />
            <input
              className={cx("input-price")}
              type="number"
              placeholder="Giá (VND)"
              value={detail.price}
              onChange={(e) => handleDetailChange(idx, "price", Number(e.target.value))}
            />
            <input
              className={cx("input-weight")}
              type="number"
              placeholder="Cân nặng (gram)"
              value={detail.weight}
              onChange={(e) => handleDetailChange(idx, "weight", Number(e.target.value))}
            />
            <button className={cx("btn-clone")} onClick={() => handleCloneDetail(idx)}>
              <FaRegClone size={20} />
            </button>
            <button className={cx("btn-delete")} onClick={() => handleRemoveDetail(idx)}>
              Xóa
            </button>
          </div>
        ))}

        {/* 🔹 Other Fee Section */}
        <div className={cx("other-fee-container")}>
          <label className={cx("header")}>
            Other fees:
            <FaSquarePlus style={{ cursor: "pointer" }} size={18} onClick={() => setArrayOtherFees((prev) => [...prev, { ...DefaultOtherFee }])} />
            <BiSolidMinusSquare
              style={{ cursor: "pointer", marginLeft: 8 }}
              size={21}
              onClick={() => setArrayOtherFees((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))}
            />
          </label>

          {arrayOtherFees.map((data, i) => (
            <div className={cx("input-row")} key={i}>
              <label>
                <input type="date" value={data.date === "none" ? "" : data.date} onChange={(e) => handleOtherFeeChange(i, "date", e.target.value)} />
              </label>
              <label>
                <input
                  type="number"
                  min={0}
                  value={data.value}
                  onChange={(e) => handleOtherFeeChange(i, "value", Number(e.target.value))}
                  placeholder="Value"
                />
              </label>
              <label>
                <input type="text" value={data.usedFor} onChange={(e) => handleOtherFeeChange(i, "usedFor", e.target.value)} placeholder="Used for?" />
              </label>
            </div>
          ))}
        </div>

        <div className={cx("modal-actions")}>
          <button type="button" className={cx("btn-secondary")} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="button" className={cx("btn-primary")} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
