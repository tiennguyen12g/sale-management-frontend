import dataTestInput from "./inventory_dataset.json"
export interface OtherFeesType {
  value: number;        // amount of the fee
  usedFor: string;      // description (invoice, translate, customs, etc.)
  date: string;         // when the fee was applied
  note?: string;
}

export interface ImportType {
  ownerID: string;
  time: string;         // when goods were imported
  idProduct: string;    // product unique ID
  productName: string;  // product name
  importQuantity: number; 
  brokenQuantity: number; 
  pricePerUnit: number;        // unit price (or total cost if per shipment)
  breakEvenPrice: number;
  supplier?: string;    // optional: supplier name/id
  batchCode: string;   // optional: batch/lot code
  shippingFee: {
    externalChinaToVietnam: number;
    internalVietnamToWarehouse: number;
  };
  otherFees: OtherFeesType[]; 
  totalCost: number;   // convenience field: (importQuantity * value + fees)
  note?: string;
  shipmentStatus: "On Delivery" | "On Selling" | "Sold Out";
  profit: number;
}

export interface ExportType {
  ownerID: string;
  time: string;         // when exported/sold
  idProduct: string;    // product unique ID
  productName: string;
  exportQuantity: number; 
  receiver: string; // export from warehouse to manager for wrapping and delivery.
  breakEvenPrice?: number;
  note?: string;
}

export interface InventoryType {
  ownerID: string;
  idProduct: string;
  productName: string;
  currentStock: number;    // real-time stock in warehouse
  averageCost: number;    // weighted avg cost per unit. calculate (total fee + total value of goods) => averageCost per unit
  totalValue: number;     // currentStock * averageCost
  warehouseLocation?: string; // optional: where stored
  note?: string;
}



