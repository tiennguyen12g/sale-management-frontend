export type MoneyInOut_Action_Type = "deposit" | "withdraw" | "payment" | "send";
export type MoneyInOut_SourceFund_Type = "Original" | "Flexible" | "Tiktok" | "Facebook" | "Shopee" | "Carrier" | "Operating" | "NetCash" | "Visa" | "Receive";
export type MoneyInOut_DestinationFund_Type = "Original" | "Flexible" | "Tiktok" | "Facebook" | "Shopee" | "Carrier" | "Tax" | "Operating" | "NetCash" | "Visa" | "Receive" | "Import" | "Salary" | "Others";

export const ArraySourceFund = ["Original" , "Flexible" , "Tiktok" , "Facebook" , "Shopee" , "Carrier", "Operating", "NetCash", "Visa", "Receive"];
export const ArrayDestinationfund = ["Original" , "Flexible" , "Tiktok" , "Facebook" , "Shopee" , "Carrier", "Tax", "Operating", "NetCash", "Visa", "Receive", "Import", "Salary" , "Others"];
export const ArrayBankAcc = ["Original", "Flexible", "Visa" , "NetCash", "Receive", "Facebook" , "Shopee", "Tiktok", "Tax", "Operating", "Import", "Salary" , "Others"];
export interface MoneyBankAccounts_Type {
  // userId: string;
  _id: string;
  owner: string;
  bankName: string;
  shortName: string;
  bankAccountNumber: number;
  type: "normal" | "visa";
  balance: number;
  revenueAdded: number;
  date?: string;
  note?: string;
}
export interface MoneyInOutDataType {
  // userId: string;
  _id: string;
  action: MoneyInOut_Action_Type;
  date: string; // using string ISO format for JSON
  value: number;
  usedFor: string;
  note: string;
  sourceFund: MoneyInOut_SourceFund_Type;
  destinationFund: MoneyInOut_DestinationFund_Type
}

import moneyDataInput from "./moneyInOutData.json";

// const moneyInOutData: MoneyInOutDataType[] = moneyDataInput.map(item => ({
//   ...item,
//   action: item.action as "deposit" | "withdraw" | "payment",
//   // sourceFund: item.sourceFund as "Original" | "Flexible" | "Tiktok" | "Facebook" | "Shopee" | "Carrier",
//   // destinationFund: item.destinationFund as "Original" | "Flexible" | "Tiktok" | "Facebook" | "Shopee" | "Carrier",
// }));
// export {moneyInOutData}