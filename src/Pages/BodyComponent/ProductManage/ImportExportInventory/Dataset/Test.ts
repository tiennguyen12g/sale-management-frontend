interface ProductDetailesType {
  name: string; // e.g. "Red - M", "Blue - L"
  stock: number;
  color: string;
  size: string; // e.g. "S", "M", "L" or "20*30cm", "30*40cm"
  price: number; // in VND
  weight: number; // in grams
  dimensions?: { length: number; width: number; height: number }; // in cm
}
interface ProductType {
  productId: string;
  name: string;
  typeProduct: string; // e.g. "Clothing", "Electronics"
  color: string;
  sizeAvailable: string[]; // e.g. ["S", "M", "L"] or ["20*30cm", "30*40cm"]
  productDetailed: ProductDetailesType[]; // detailed price list based on size and color
  genderTarget?: string; // e.g. Male or Female or Unisex or Baby or Kids
  imageUrl: string;
  description?: string;
  category?: string;
  stock?: number;
  supplier?: string;
  tags?: string[];
  warranty?: string;
  salesCount?: number; // number of times the product has been sold
  createdAt?: string; // date when the product was added to the system
  updatedAt?: string; // date when the product details were last updated
  notes?: string; // any additional notes about the product
}
export interface OtherFeesType {
  value: number;        // amount of the fee
  usedFor: string;      // description (invoice, translate, customs, etc.)
  date: string;         // when the fee was applied
  note?: string;
}
interface ProductClassificationType{
    color: string;
    amount: number;
    size: string;
    name: string;
    material: string;
}
export interface ImportType {
    _id: string;
  ownerID?: string;
  time: string;         // when goods were imported
  idProduct: string;    // product unique ID
  productName: string;  // product name
  importQuantity: number; 
  brokenQuantity: number; 
  pricePerUnit: number;        // unit price (or total cost if per shipment)
  breakEvenPrice?: number;
  supplier?: string;    // optional: supplier name/id
  batchCode?: string;   // optional: batch/lot code
  shippingFee: {
    externalChinaToVietnam: number;
    internalVietnamToWarehouse: number;
  };
  otherFees: OtherFeesType[]; 
  totalCost: number;   // convenience field: (importQuantity * value + fees)
  note?: string;
  shipmentStatus?: "On Importing" | "On Selling" | "Sold Out";
  revenue?:number;
  profit?: number;
  estimateSellingPrice?: number;
  productClassification: ProductClassificationType[];
}