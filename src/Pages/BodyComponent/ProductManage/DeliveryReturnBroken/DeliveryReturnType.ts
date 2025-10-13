import ordersDatasetInput from "./orders_dataset.json";
// Voucher dictionary (reference values, not strict typing)
const VoucherValue: Record<"Freeship" | "Discount" | "Sale", number> = {
  Freeship: 30000,
  Discount: 20000,
  Sale: 50000,
};

type CarrierNameType = "J&T" | "Viettel Post" | "GHTK" | "GHN" | "SPX" | "VN Post";

// Carrier fee reference table
const CarrierFee: Record<CarrierNameType, number> = {
  "J&T": 20000,
  "Viettel Post": 30000,
  "GHTK": 20000,
  "GHN": 22000,
  "SPX": 18000,
  "VN Post": 23000,
};

// One voucher applied to product/order
interface VoucherType {
  name: "Freeship" | "Discount" | "Sale";
  value: number; // take from VoucherValue
}

interface ProductOrderType {
  productName: string;
  quantity: number;
  pricePerUnit: number;  // ✅ useful for calculating total
  vouchers?: VoucherType[];
  idProduct?: string;
}

type OrderStatusType = "onDelivery" | "success" | "return" | "lost" | "complaint";

export interface BuyerInfoType {
    name: string;
    phone: string;
    address: string;
    note?: string;
    blackList?: boolean;
}
interface OrderType {
  // Buyer info
  buyerInfos: BuyerInfoType;

  // Products in this order
  productInfos: ProductOrderType[];

  // Business logic
  platform: "Tiktok" | "Shopee" | "Facebook" | "Website" | "Other"; // ✅ where order came from
  whoClosedOrder: string; // staff name / auto system
  numberOfGoods: number; // total quantity
  totalOrderValue: number; // before vouchers
  vouchers?: VoucherType[]; // order-level vouchers
  codValue: number; // amount shipper collects
  refundValue?: number; // in case of return/refund

  // Logistics
  weight?: number; // grams / kg
  size?: string; // Length*Width*Height
  sendTime: string;
  completeTime?: string; // empty until success/return
  carrierName: CarrierNameType;
  shippingFee: number; // derived from CarrierFee[carrierName]
  myOwnShippingID: string;
  carrierShippingID: string;
  statusOrder: OrderStatusType;
  reasonReturn?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}


const ordersData: OrderType[] = ordersDatasetInput.orders.map((item: any) => ({
  ...item,
  productInfos: item.productInfos.map((prod: any) => ({
    ...prod,
    vouchers: prod.vouchers?.map((v: any) => ({
      ...v,
      name: v.name as "Freeship" | "Discount" | "Sale",
    })),
  })),
  vouchers: item.vouchers?.map((v: any) => ({
    ...v,
    name: v.name as "Freeship" | "Discount" | "Sale",
  })),
  carrierName: item.carrierName as CarrierNameType,  // ✅ force type match
  statusOrder: item.statusOrder as OrderStatusType,  // ✅ force type match
}));


export type {
    CarrierNameType,
    VoucherType,
    OrderStatusType,
    OrderType,
    ProductOrderType,
    
}

export {
    CarrierFee,
    VoucherValue,
    ordersData
}