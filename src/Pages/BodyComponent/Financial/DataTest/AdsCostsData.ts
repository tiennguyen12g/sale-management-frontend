import adsCostsDataInput from "./AdsCostsData.json";

export type PlatformName = "TikTok" | "Facebook" | "Shopee";
export interface AdsCostType {
  _id: string;
  platform: PlatformName
  date: string; // YYYY-MM-DD
  spendActual: number;
  ordersDelivered: number;
  ordersReturned: number;
  netRevenue: number; // after returns/refunds
  platformFee?: number;
  returnFee?: number; // This fee incluse ship-back and broken goods
  targetProduct?: string;
  idProduct?: string;
  // id: string;
}

// const adsCostsData: Omit<AdsCostType, "_id">[] = adsCostsDataInput.map(item => ({
//   ...item,
//   platform: item.platform as PlatformName
// }));

// export { adsCostsData };
