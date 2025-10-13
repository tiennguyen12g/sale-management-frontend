import React, { type Dispatch } from "react";
import classNames from "classnames/bind";
import styles from "./Box.module.scss";
const cx = classNames.bind(styles);
import type { MoneyBankAccounts_Type } from "../../DataTest/DataForMoney";
import { MdModeEditOutline } from "react-icons/md";

interface SegmentType {
  name: string;
  value: number;
}
interface Props {
  titleBox: string;
  arrayData: SegmentType[];
  arrayCardInfos?: MoneyBankAccounts_Type[];
  boxType: "normal" | "box-bank";
  setBankEditData?: Dispatch<React.SetStateAction<MoneyBankAccounts_Type>>;
  setIsShowEditBankBox?: Dispatch<React.SetStateAction<boolean>>;
}
export default function Box3({ titleBox, arrayData, arrayCardInfos, boxType, setBankEditData, setIsShowEditBankBox }: Props) {
  const handleEditBank = (data: MoneyBankAccounts_Type) => {
    if (setBankEditData && setIsShowEditBankBox) {
      setIsShowEditBankBox(true);
      setBankEditData(data);
    }
  };

  return (
    <div className={cx("box-main")}>
      <div className={cx("title")} style={{ fontWeight: 550 }}>
        {titleBox}
      </div>
      <div className={cx("horizontal-line")}></div>
      <div className={cx("details")}>
        {boxType === "normal" &&
          arrayData.map((item, i) => {
            const isShowVerticalLine = i === arrayData.length - 1 ? false : true;
            return (
              <div key={i} className={cx("segment-data")}>
                <div>
                  <div style={{ fontWeight: 550 }}>{item.name}</div>
                  <div>{item.value.toLocaleString("vi-VN")}₫</div>
                </div>
                {isShowVerticalLine && <div className={cx("vertical-line")}></div>}
              </div>
            );
          })}
        {boxType === "box-bank" &&
          arrayCardInfos &&
          arrayCardInfos.map((cardInfos, i) => {
            const isShowVerticalLine = i === arrayCardInfos.length - 1 ? false : true;
            return (
              <div key={i} className={cx("segment-data")}>
                <div>
                  <div style={{ fontWeight: 550 }}>
                    {cardInfos.shortName} <MdModeEditOutline size={18} onClick={() => handleEditBank(cardInfos)} />
                  </div>
                  <div>{cardInfos.revenueAdded?.toLocaleString("vi-VN") || 0}₫</div>
                </div>
                {isShowVerticalLine && <div className={cx("vertical-line")}></div>}
                {cardInfos && (
                  <div className={cx("infoBox")}>
                    <p>
                      <strong>Owner:</strong> {cardInfos.owner}
                    </p>
                    <p>
                      <strong>Bank:</strong> {cardInfos.bankName} ({cardInfos.shortName})
                    </p>
                    <p>
                      <strong>Account Number:</strong> {cardInfos.bankAccountNumber}
                    </p>
                    <p>
                      <strong>Type:</strong> {cardInfos.type}
                    </p>
                    <p>
                      <strong>Balance:</strong> {cardInfos.balance.toLocaleString("vi-VN")} ₫
                    </p>
                    {cardInfos.owner === "Facebook" && (
                      <p>
                        <strong>Revenue:</strong> {cardInfos.revenueAdded?.toLocaleString("vi-VN") || 0} ₫
                      </p>
                    )}
                    {cardInfos.owner === "Tiktok" && (
                      <p>
                        <strong>Revenue:</strong> {cardInfos.revenueAdded?.toLocaleString("vi-VN") || 0} ₫
                      </p>
                    )}
                    {cardInfos.owner === "Shopee" && (
                      <p>
                        <strong>Revenue:</strong> {cardInfos.revenueAdded?.toLocaleString("vi-VN") || 0} ₫
                      </p>
                    )}
                    <p>
                      <strong>Date:</strong> {cardInfos.date}
                    </p>
                    <p>
                      <strong>Note:</strong> {cardInfos.note}
                    </p>
                    {/* <p><strong>Created At:</strong> {new Date(cardInfos.date).toLocaleString()}</p> */}
                    {/* <p><strong>Updated At:</strong> {new Date(cardInfos.updatedAt).toLocaleString()}</p> */}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
