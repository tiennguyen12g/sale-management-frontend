import React, { useState, type Dispatch } from "react";
import classNames from "classnames/bind";
import styles from "./Card.module.scss";
const cx = classNames.bind(styles);

import type { MoneyBankAccounts_Type } from "../../DataTest/DataForMoney";
import { MdModeEditOutline } from "react-icons/md";
interface Props {
  cardName: string;
  cardValue: number;
  cardInfos?: MoneyBankAccounts_Type;
  boxType: "normal" | "box-bank";
    setBankEditData?: Dispatch<React.SetStateAction<MoneyBankAccounts_Type>>;
    setIsShowEditBankBox?: Dispatch<React.SetStateAction<boolean>>;
}

export default function Card({
  cardName,
  cardValue,
  cardInfos,
  boxType,
  setBankEditData,
  setIsShowEditBankBox
}: Props) {


  let balance = 0;
  if (cardInfos) {
    balance = cardInfos.balance;
  }
  const valueShow = boxType === "box-bank" ? balance : cardValue;


    const handleEditBank = (data: MoneyBankAccounts_Type) => {
      if (setBankEditData && setIsShowEditBankBox) {
        setIsShowEditBankBox(true);
        setBankEditData(data);
      }
    };
  return (
    <div className={cx("card")}>
      <h4>{cardName} <MdModeEditOutline size={18} 
      onClick={() => {
        if(cardInfos) handleEditBank(cardInfos);
      }} /></h4>
      <p>{valueShow.toLocaleString("vi-VN")} ₫</p>

      {cardInfos && (
        <div className={cx("infoBox")}>
          <p><strong>Owner:</strong> {cardInfos.owner}</p>
          <p><strong>Bank:</strong> {cardInfos.bankName} ({cardInfos.shortName})</p>
          <p><strong>Account Number:</strong> {cardInfos.bankAccountNumber}</p>
          <p><strong>Type:</strong> {cardInfos.type}</p>
          <p><strong>Balance:</strong> {cardInfos.balance.toLocaleString("vi-VN")} ₫</p>
          <p><strong>Date:</strong> {cardInfos.date}</p>
          <p><strong>Note:</strong> {cardInfos.note}</p>
        </div>
      )}
    </div>
  );
}
