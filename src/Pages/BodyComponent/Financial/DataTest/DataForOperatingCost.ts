import operatingCostsInput from "./operatingCostsData.json";

export type OperatingAcctionType = "electric" | "water" | "internet" | "phone" | "software" | "othercost";
export interface OperatingCostsDataType {
  action: OperatingAcctionType
  date: string; // using string ISO format for JSON
  value: number;
  usedFor: string;
  note: string;
  _id: string;
}
// const operatingCostsData : OperatingCostsDataType[] = operatingCostsInput.map(item => ({
//   ...item,
//   action: item.action as "electric" | "water" | "internet" | "phone" | "software" | "othercost"
// }));
// export {operatingCostsData}