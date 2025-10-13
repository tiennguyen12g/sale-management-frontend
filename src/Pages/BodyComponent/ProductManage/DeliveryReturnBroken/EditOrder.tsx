import React, { useState } from "react";
import styles from "./EditOrder.module.scss";
import classNames from "classnames/bind";
import type { OrderType, ProductOrderType } from "./DeliveryReturnType";

const cx = classNames.bind(styles);

interface Props {
  order: OrderType;
  onClose: () => void;
  onSave: (order: OrderType) => void;
}

export default function EditOrder({ order, onClose, onSave }: Props) {
  const [form, setForm] = useState<OrderType>(order);

  const handleChange = (field: keyof OrderType, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBuyerChange = (field: keyof OrderType["buyerInfos"], value: any) => {
    setForm((prev) => ({
      ...prev,
      buyerInfos: { ...prev.buyerInfos, [field]: value },
    }));
  };

  const handleProductChange = (index: number, field: keyof ProductOrderType, value: any) => {
    const newProducts = [...form.productInfos];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setForm((prev) => ({ ...prev, productInfos: newProducts }));
  };

  const handleSubmit = async () => {
    await fetch("http://localhost:6000/api-v1/delivery-return?action=edit&type=manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onSave(form);
  };

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-content")}>
        <h3>Edit Order</h3>

        {/* Buyer Info */}
        <fieldset>
          <legend>Buyer Info</legend>
          <div className={cx("double-label")}>
            <label>
              Name:
              <input value={form.buyerInfos.name} onChange={(e) => handleBuyerChange("name", e.target.value)} />
            </label>
            <label>
              Phone:
              <input value={form.buyerInfos.phone} onChange={(e) => handleBuyerChange("phone", e.target.value)} />
            </label>
          </div>
          <div className={cx("double-label")}>
            <label>
              Address:
              <input value={form.buyerInfos.address} onChange={(e) => handleBuyerChange("address", e.target.value)} />
            </label>
            <label>
              Note:
              <input value={form.buyerInfos.note || ""} onChange={(e) => handleBuyerChange("note", e.target.value)} />
            </label>
          </div>
        </fieldset>

        {/* Product Infos */}
        <fieldset>
          <legend>Products</legend>
          {form.productInfos.map((p, idx) => (
            <div key={idx} className={cx("product-row")}>
              <input value={p.productName} onChange={(e) => handleProductChange(idx, "productName", e.target.value)} />
              <input type="number" value={p.quantity} onChange={(e) => handleProductChange(idx, "quantity", Number(e.target.value))} />
              <input type="number" value={p.pricePerUnit} onChange={(e) => handleProductChange(idx, "pricePerUnit", Number(e.target.value))} />
            </div>
          ))}
        </fieldset>

        {/* Logistics + Business */}
        <fieldset>
          <legend>Order Info</legend>
          <div className={cx("double-label")}>
            <label>
              Platform:
              {/* <input value={form.platform} onChange={(e) => handleChange("platform", e.target.value)} /> */}
              <select value={form.platform} onChange={(e) => handleChange("platform", e.target.value)}>
                <option value="Facebook">Facebook</option>
                <option value="Tiktok">Tiktok</option>
                <option value="Shopee">Shopee</option>
                <option value="Website">Website</option>
              </select>
            </label>
            <label>
              Who Closed Order:
              <input value={form.whoClosedOrder} onChange={(e) => handleChange("whoClosedOrder", e.target.value)} />
            </label>
          </div>
          <div className={cx("double-label")}>
            <label>
              COD Value:
              <input type="number" value={form.codValue} onChange={(e) => handleChange("codValue", Number(e.target.value))} />
            </label>
            <label>
              Refund Value:
              <input type="number" value={form.refundValue || 0} onChange={(e) => handleChange("refundValue", Number(e.target.value))} />
            </label>
          </div>
          <div className={cx("double-label")}>
            <label>
              Weight:
              <input type="number" value={form.weight || 0} onChange={(e) => handleChange("weight", Number(e.target.value))} />
            </label>
            <label>
              Size:
              <input value={form.size || ""} onChange={(e) => handleChange("size", e.target.value)} />
            </label>
          </div>
          <div className={cx("double-label")}>
            <label>
              Carrier:
              {/* <input value={form.carrierName} onChange={(e) => handleChange("carrierName", e.target.value)} /> */}
              <select value={form.carrierName} onChange={(e) => handleChange("carrierName", e.target.value)}>
                <option value="J&T">J&T</option>
                <option value="SPX">SPX</option>
                <option value="Viettel Post">Viettel Post</option>
              </select>
            </label>
            <label>
              My Shipping ID:
              <input value={form.myOwnShippingID} onChange={(e) => handleChange("myOwnShippingID", e.target.value)} />
            </label>
          </div>
          <div className={cx("double-label")}>
            <label>
              Carrier Shipping ID:
              <input value={form.carrierShippingID} onChange={(e) => handleChange("carrierShippingID", e.target.value)} />
            </label>
            <label>
              Status:
              <select value={form.statusOrder} onChange={(e) => handleChange("statusOrder", e.target.value)}>
                <option value="onDelivery">On Delivery</option>
                <option value="success">Success</option>
                <option value="return">Return</option>
                <option value="lost">Lost</option>
              </select>
            </label>
          </div>
          <label>
            Reason Return:
            <input value={form.reasonReturn || ""} onChange={(e) => handleChange("reasonReturn", e.target.value)} />
          </label>
        </fieldset>

        {/* Readonly timestamps */}
        <fieldset>
          <legend>Timestamps</legend>
          <p>Send Time: {form.sendTime}</p>
          <p>Complete Time: {form.completeTime || "waiting"}</p>
          <p>Created: {form.createdAt}</p>
          <p>Updated: {form.updatedAt}</p>
        </fieldset>

        <div className={cx("actions")}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
