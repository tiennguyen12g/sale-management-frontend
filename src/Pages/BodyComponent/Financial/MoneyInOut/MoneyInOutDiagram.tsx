import React, { type Dispatch } from "react";
import classNames from "classnames/bind";
import styles from "./MoneyInOutDiagram.module.scss";
import Arrow from "./DiagramSegment/Arrow";
import Card from "./DiagramSegment/Card";
import Box from "./DiagramSegment/Box";
import Arrow2 from "./DiagramSegment/Arrow2";

import Arrow3 from "./DiagramSegment/Arrow3";
import Arrow2v2 from "./DiagramSegment/Arrow2v2";
import Arrow2v3 from "./DiagramSegment/Arrow2v3";
import Arrow3v2 from "./DiagramSegment/Arrow3v2";
import ArrowDown from "./DiagramSegment/ArrowDown";
import ArrowUp from "./DiagramSegment/ArrowUp";
import Box2 from "./DiagramSegment/Box2";
import Box3 from "./DiagramSegment/Box3";
import type { MoneyBankAccounts_Type } from "../DataTest/DataForMoney";
const cx = classNames.bind(styles);
export interface SegmentType {
  name: string;
  value: number;
}
export interface MoneyTransitionType {
  owner: string;
  totalSend: number;
  totalWithdraw: number;
  totalDeposit: number;
}
export interface DiagramProps {
  spendData?: SegmentType[];
  revenueData?: SegmentType[];
  paymentData?: SegmentType[];
  depositToVisa?: SegmentType[];
  moneyTransition?: {
    original: MoneyTransitionType;
    flexible: MoneyTransitionType;
    payment?: MoneyTransitionType;
    cashOut?: MoneyTransitionType;
    visa?: MoneyTransitionType;
    receiveAcc?: MoneyTransitionType;
    revenue?: MoneyTransitionType;
    netCash?: MoneyTransitionType;
    facebook?: MoneyTransitionType;
    tiktok?: MoneyTransitionType;
    shopee?: MoneyTransitionType;
    carrier?: MoneyTransitionType;
    salary?: MoneyTransitionType;
  };
  bankAccounts: MoneyBankAccounts_Type[];
  setBankEditData: Dispatch<React.SetStateAction<MoneyBankAccounts_Type>>;
  setIsShowEditBankBox: Dispatch<React.SetStateAction<boolean>>;
}

interface ListBankType {
  originalBank: MoneyBankAccounts_Type;
  flexibleBank: MoneyBankAccounts_Type;
  visas: MoneyBankAccounts_Type[];
  receiveBank: MoneyBankAccounts_Type;
  netcashBank: MoneyBankAccounts_Type;
  facebookBank: MoneyBankAccounts_Type;
  shopeeBank: MoneyBankAccounts_Type;
  tiktokBank: MoneyBankAccounts_Type;
  taxBank: MoneyBankAccounts_Type;
  operatingBank: MoneyBankAccounts_Type;
  salaryBank: MoneyBankAccounts_Type;
  importBank: MoneyBankAccounts_Type;
  othersBank: MoneyBankAccounts_Type;
}
export default function MoneyInOutDiagram({
  moneyTransition,
  bankAccounts,
  setBankEditData,
  setIsShowEditBankBox,
}: DiagramProps) {
  const defaultBankData: Omit<MoneyBankAccounts_Type, "owner"> = {
    _id: "",
    bankName: "",
    shortName: "",
    bankAccountNumber: 123456789,
    type: "normal",
    balance: 0,
    revenueAdded: 0,
    date: new Date().toISOString().split("T")[0],
    note: "",
  };
  // Map of required single banks
  const requiredBanks = [
    "Original",
    "Flexible",
    "Receive",
    "NetCash",
    "Facebook",
    "Shopee",
    "Tiktok",
    "Tax",
    "Operating",
    "Salary",
    "Import",
    "Others",
  ] as const;

  // Initialize base listBanks
  let listBanks: ListBankType = {
    originalBank: { owner: "Original", ...defaultBankData },
    flexibleBank: { owner: "Flexible", ...defaultBankData },
    visas: [],
    receiveBank: { owner: "Receive", ...defaultBankData },
    netcashBank: { owner: "NetCash", ...defaultBankData },
    facebookBank: { owner: "Facebook", ...defaultBankData },
    shopeeBank: { owner: "Shopee", ...defaultBankData },
    tiktokBank: { owner: "Tiktok", ...defaultBankData },
    taxBank: { owner: "Tax", ...defaultBankData },
    operatingBank: { owner: "Operating", ...defaultBankData },
    salaryBank: { owner: "Salary", ...defaultBankData },
    importBank: { owner: "Import", ...defaultBankData },
    othersBank: { owner: "Others", ...defaultBankData },
  };

  // Assign actual bank accounts
  bankAccounts.forEach((acc) => {
    if (acc.owner === "Visa") {
      listBanks.visas.push(acc);
    } else if (requiredBanks.includes(acc.owner as any)) {
      const key = (acc.owner.toLowerCase() + "Bank") as keyof ListBankType; // e.g. facebookBank
      if (key !== "visas") {
        listBanks[key] = acc;
      }
    }
  });

  const groupPayments = [listBanks.taxBank, listBanks.operatingBank, listBanks.salaryBank, listBanks.importBank, listBanks.othersBank];

  // Helpers

  const ConvertSocialBankToSegment = () => {
    const facebook: SegmentType = { value: moneyTransition?.facebook?.totalDeposit || 0, name: moneyTransition?.facebook?.owner || "None" };
    const tiktok: SegmentType = { value: moneyTransition?.tiktok?.totalDeposit || 0, name: moneyTransition?.tiktok?.owner || "None" };
    const shopee: SegmentType = { value: moneyTransition?.shopee?.totalDeposit || 0, name: moneyTransition?.shopee?.owner || "None" };
    const data = [facebook, tiktok, shopee];
    return data;
  };

  const GroupSocialRevenue = () => {
    const data = [listBanks.facebookBank, listBanks.tiktokBank, listBanks.shopeeBank];
    return data;
  };

  const calculatePNL = (moneyTransition?.receiveAcc?.totalWithdraw || 0) - (moneyTransition?.original.totalSend || 0);
  const pnlColor = calculatePNL > 0 ? "green" : "red";
  return (
    <div className={cx("wrapper")}>
      {/* Column 1 */}
      <Card
        cardName="Net.Cash"
        cardValue={0}
        boxType="box-bank"
        cardInfos={listBanks.netcashBank}
        setBankEditData={setBankEditData}
        setIsShowEditBankBox={setIsShowEditBankBox}
      />
      <div className={cx("two-way-arrow")}>
        {/* For NetCash Send */}
        <Arrow arrowAngle={0} arrowText="T.Send" arrowValue={moneyTransition?.netCash?.totalSend || 0} arrowColor="#5cd10d" />

        {/* For Origin Withdraw */}
        <Arrow arrowAngle={180} arrowText="T.Withdraw" arrowValue={moneyTransition?.original.totalWithdraw || 0} arrowColor="red" />
      </div>

      {/* Column 2 */}
      <Card
        cardName="Original"
        cardValue={0}
        boxType="box-bank"
        cardInfos={listBanks.originalBank}
        setBankEditData={setBankEditData}
        setIsShowEditBankBox={setIsShowEditBankBox}
      />
      <div className={cx("two-way-arrow2")}>
        {/* For Origin Send */}
        <Arrow3 arrowAngle={0} arrowText="T.Send" arrowValue={moneyTransition?.original.totalSend || 0} arrowColor="#5cd10d" />
        <div>
          <div>Estimate PNL </div>
          <div style={{ color: pnlColor, fontWeight: 550 }}>{calculatePNL.toLocaleString("vi-VN")}₫</div>
        </div>
        {/* For Flexible Withdraw */}
        <Arrow2v2 arrowAngle={180} arrowText="T.Withdraw" arrowValue={moneyTransition?.receiveAcc?.totalWithdraw || 0} arrowColor="red" />
      </div>

      {/* Column 3 */}
      <div className={cx("column3")}>
        <Card
          cardName="Flexible"
          cardValue={0}
          boxType="box-bank"
          cardInfos={listBanks.flexibleBank}
          setBankEditData={setBankEditData}
          setIsShowEditBankBox={setIsShowEditBankBox}
        />
        <ArrowUp arrowAngle={180} arrowText="T.Send" arrowValue={moneyTransition?.receiveAcc?.totalSend || 0} arrowColor="#f78c28" />
        <Card
          cardName="Receive"
          cardValue={0}
          boxType="box-bank"
          cardInfos={listBanks.receiveBank}
          setBankEditData={setBankEditData}
          setIsShowEditBankBox={setIsShowEditBankBox}
        />
      </div>
      <div className={cx("three-way-arrow")}>
        {/* <Arrow3v2 arrowAngle={180} arrowText="T.Send" arrowValue={1000} arrowColor="blue"/> */}

        {/* For Flexible send to Visa */}
        <div className={cx("arrow-above")}>
          <Arrow arrowAngle={0} arrowText="T.Send" arrowValue={moneyTransition?.visa?.totalDeposit || 0} arrowColor="#5cd10d" />
        </div>
        {/* <div className={cx('arrow-above')}>
          <Arrow arrowAngle={0} arrowText="T.Send" arrowValue={moneyTransition?.visa?.totalDeposit || 0} arrowColor="#5cd10d" />
        </div> */}
        {/* For Flexible send to Payment */}
        <div className={cx("arrow-center")}>
          <Arrow2 arrowAngle={0} arrowText="T.Send" arrowValue={moneyTransition?.payment?.totalDeposit || 0} arrowColor="#5cd10d" />
        </div>

        {/* For Revenue withdraw to Flexible */}
        <Arrow arrowAngle={180} arrowText="T.Cash Back" arrowValue={moneyTransition?.revenue?.totalWithdraw || 0} arrowColor="red" />
      </div>

      {/* Column 4 */}
      <div className={cx("column4")}>
        <Box
          titleBox="Deposit To Visa"
          arrayData={[]}
          boxType="box-bank"
          arrayCardInfos={listBanks.visas}
          setBankEditData={setBankEditData}
          setIsShowEditBankBox={setIsShowEditBankBox}
        />
        {/* <Box
          titleBox="Import Product"
          arrayData={[]}
          boxType="box-bank"
          arrayCardInfos={listBanks.visas}
          setBankEditData={setBankEditData}
          setIsShowEditBankBox={setIsShowEditBankBox}
        /> */}
        <Box
          titleBox="Payment"
          arrayData={[]}
          boxType="box-bank"
          isOneWayAccount={true}
          arrayCardInfos={groupPayments}
          setBankEditData={setBankEditData}
          setIsShowEditBankBox={setIsShowEditBankBox}
        />
        <Box3
          titleBox="Revenue"
          arrayData={[]}
          boxType="box-bank"
          arrayCardInfos={GroupSocialRevenue()}
          setBankEditData={setBankEditData}
          setIsShowEditBankBox={setIsShowEditBankBox}
        />
      </div>
      <div>
        <Arrow arrowAngle={0} arrowText="T.Costs" arrowValue={moneyTransition?.visa?.totalSend || 0} arrowColor="#5cd10d" />
        {/* <div className={cx("virtual-box2")}></div> */}
        {/* <div className={cx("virtual-box")}></div> */}
        <div className={cx("connect-payment-order")}>
          {" "}
          <Arrow2v3 arrowAngle={0} arrowText="T.Paid" arrowValue={moneyTransition?.payment?.totalDeposit || 0} arrowColor="orange" />
        </div>
        <Arrow arrowAngle={180} arrowText="T.Revenue" arrowValue={moneyTransition?.carrier?.totalWithdraw || 0} arrowColor="red" />
      </div>

      {/* Column 5 */}
      <div className={cx("box-spend")}>
        <Box titleBox="Ads Spent" arrayData={ConvertSocialBankToSegment()} boxType="normal" isOneWayAccount={true} />
        <ArrowDown arrowAngle={90} arrowText="Convert" arrowValue={0} arrowColor="#f78c28" />
        <Box2 titleBox="Total Orders" arrayData={testOrder} />
      </div>
    </div>
  );
}

const testOrder = [
  {
    name: "Facebook",
    value: 15345,
  },
  {
    name: "Tiktok",
    value: 64352,
  },
  {
    name: "Shopee",
    value: 94235,
  },
];
