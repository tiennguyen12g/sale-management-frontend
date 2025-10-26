import React, { useEffect, useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./ShopOrders.module.scss";
const cx = classNames.bind(styles);

import { Link, Navigate, NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { IoIosCopy } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";

import deliveryTruck from "./icons/delivery-truck.gif";
import atm from "./icons/atm.gif";
import dislike from "./icons/dislike.gif";
import hourglass from "./icons/hourglass.gif";
import conveyorBelt from "./icons/conveyor-belt.gif";
import phone from "./icons/phone.gif";
import soldout from "./icons/sold-out.gif";
import outOfStock from "./icons/sold.png";
import courier from "./icons/courier.gif";
import { HiMinusSmall } from "react-icons/hi2";
import { HiPlusSmall } from "react-icons/hi2";
import { IoDiamondSharp } from "react-icons/io5";
import { GiDividedSquare } from "react-icons/gi";
import { useAuthStore } from "../zustand/authStore";
import CreateExcel from "./CreateExcel";
import VnAddressSelect_Old from "../ultilitis/VnAddress/VnAddressOld";
import { type ProductType, type ProductDetailsType } from "../zustand/productStore";
import { useShopOrderStore, type OrderItem, type OrderDataFromServerType, type OriginalOrder, type FinalOrder } from "../zustand/shopOrderStore";
import { useStaffStore, type StaffRole } from "../zustand/staffStore";
import UploadExcelBox from "../ultilitis/UploadExcelBox";
import StaffTracking from "./StaffTracking";
type VirtualCartType = ProductDetailsType & { quantity: number; isSelected: boolean };

const COLORS: Record<string, string> = {
  đen: "#000000",
  trắng: "#FFFFFF",
  "xanh dương": "#007BFF", // xanh dương (blue) – adjust if you mean "green"
  đỏ: "#FF0000",
  "xanh lá cây": "#02a51d",
  vàng: "#FFD700",
  hồng: "#FFC0CB",
  tím: "#800080",
  cam: "#FFA500",
  nâu: "#8B4513",
  xám: "#808080",
  be: "#F5F5DC",
  "xanh nõn chuối": "#a7e9b2",
};

const STATUS_OPTIONS = [
  "Chưa gọi điện",
  "Không gọi được lần 1",
  "Không gọi được lần 2",
  "Không gọi được lần 3",
  "Khách không mua",
  "Sale hủy",
  "Sai số",
  "Chốt",
  "Đơn mới",
];
// For delivery status, you should add the update time for each status change.
const DeliveryOptions = [
  "Chưa gửi hàng",
  "Đang đóng hàng",
  "Đã gửi hàng",
  "Đang giao hàng",
  "Giao thành công",
  "Giao thất bại",
  "Khách chưa chốt",
  "Đang hết hàng",
];
const DeliveryOptionsForStaffSelectManual = ["Chưa gửi hàng", "Đang đóng hàng", "Đã gửi hàng", "Đang hết hàng"];
const STAFF_OPTIONS = ["TNBT", "hoangdung", "tamlong"];
export type SortOrder = "latest" | "oldest";

interface ShopOrdersProps {
  productDetail: ProductType;
  dataOrders: OrderDataFromServerType[];
}
export default function ShopOrders({ productDetail, dataOrders }: ShopOrdersProps) {
  // const {fetchProducts, updateProduct, addProduct, deleteProduct } = useProductStore();
  // console.log(productDetail.name, productDetail);
  console.log("dataOrders", dataOrders);
  const { updateOrder, deleteOrder, addOrder, updateMultipleOrders, uploadOrdersExcel } = useShopOrderStore();
  const { user, logout } = useAuthStore();
  const { staffList, updateStaffID } = useStaffStore();
  const [staffName, setStaffName] = useState<string[]>(["Không"]);
  const [staffID, setStaffID] = useState("none");

  const staffRole: StaffRole | "none" = user?.staffRole || "none";
  useEffect(() => {
    // console.log('staff', staffList);
    if (staffList[0]?.staffInfo?.name) {
      // const newStaffName = [staffList[0].staffInfo.name, ...staffName]
      setStaffName([staffList[0].staffInfo.name]);
    }
    if (staffList[0]?.staffID) {
      setStaffID(staffList[0].staffID);
      updateStaffID(staffList[0].staffID);
    }
  }, [staffList]);

  let serverOriginalOrderData: OriginalOrder[] = [];
  let serverFinalOrderData: FinalOrder[] = [];
  dataOrders.forEach((item) => {
    serverOriginalOrderData.push(item.original);
    serverFinalOrderData.push(item.final);
  });

  // useEffect(() =>{
  //   if(dataOrders.length > 0){
  //       dataOrders.forEach((item) => {
  //   serverOriginalOrderData.push(item.original);
  //   serverFinalOrderData.push(item.final);
  // });
  //   }
  // },[dataOrders])

  const productId = productDetail.productId;
  const [viewMode, setViewMode] = useState<"table" | "excel">("table");

  const [orders, setOrders] = useState<FinalOrder[]>(serverFinalOrderData);
  const [originOrder, setOriginOrder] = useState<OriginalOrder | null>(null);

  // filter state
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["All"]);
  const [sortBy, setSortBy] = useState<SortOrder>("latest");
  const [deliveryStatuses, setDeliveryStatuses] = useState<string>("All");
  const [currentBuyerInfo, setCurrentBuyerInfo] = useState({
    province: "",
    district: "",
    commune: "",
  });
  const [correctedAddress, setCorrectedAddress] = useState<string | null>(null);
  const [openUpdateDeliveryBox, setOpenUpdateDeliveryBox] = useState<boolean>(false);
  const [selectedDeliveryStatusForUpdate, setSelectedDeliveryStatusForUpdate] = useState<string>(DeliveryOptionsForStaffSelectManual[0]);

  const [createNewOrderBox, setCreateNewOrderBox] = useState<boolean>(false);
  const [showListProduct, setShowListProduct] = useState(false);
  const localTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  const [defaultNewOrder, setDefaultNewOrder] = useState<FinalOrder>({
    // "_id": (Math.random() * 1000000).toFixed(0),
    // staffId: "",
    orderCode: "default",
    time: localTime.toString(),
    customerName: "",
    phone: "",
    address: "",
    orderInfo: [], //{ product: "", color: "", size: "", quantity: 1, price: 0 }
    total: 0,
    totalProduct: 0,
    totalWeight: 0,
    note: "",
    status: "Chưa gọi điện",
    confirmed: false,
    staff: staffName[0],
    buyerIP: "",
    website: "",
    deliveryStatus: "Chưa gửi hàng",
    deliveryCode: "",
    facebookLink: "",
    tiktokLink: "",
  });

  useEffect(() => {
    setDefaultNewOrder((prev) => {
      return { ...prev, staff: staffName[0] };
    });
    setNewOrder((prev) => {
      return { ...prev, staff: staffName[0] };
    });
  }, [staffName]);
  const [newOrder, setNewOrder] = useState<FinalOrder>({ ...defaultNewOrder });
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [hasDeleteOrder, setHasDeleteOrder] = useState(false);
  const [editing, setEditing] = useState<FinalOrder>({ ...defaultNewOrder });
  const [showEditingBox, setShowEditingBox] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [hasChangeData, setHasChangeData] = useState(false);
  const defaultVirtualCart = useMemo(() => {
    return (
      productDetail?.productDetailed?.map((p: ProductDetailsType) => ({
        ...p,
        quantity: 0,
        isSelected: false,
      })) ?? []
    );
  }, [productDetail]);

  // ✅ virtualCart can be changed by user
  const [virtualCart, setVirtualCart] = useState<VirtualCartType[]>(defaultVirtualCart);

  const [filterColorInAddProduct, setFilterColorInAddProduct] = useState("None");
  const [isExceedStock, setIsExceedStock] = useState<number | null>(null);
  const [searchOrderCode, setSearchOrderCode] = useState<string | null>(null);

  const [showUploadExcel, setShowUploadExcel] = useState(false);
  // ✅ Sync virtualCart with productDetail changes
  // useEffect(() => {
  //   setVirtualCart(defaultVirtualCart);
  // }, [defaultVirtualCart]);

  // --- CRITICAL: sync local orders state when incoming prop changes ---
  useEffect(() => {
    // update local orders to match incoming dataOrders for this product
    setOrders(serverFinalOrderData);

    // reset UI/editing state when product changes
    setOriginOrder(null);
    setEditing({ ...defaultNewOrder });
    setShowListProduct(false);
    setCorrectedAddress(null);
    setVirtualCart(defaultVirtualCart);
    setShowEditingBox(false);
  }, [dataOrders, productDetail, defaultVirtualCart]); // re-run when data/orders or product change

  const sortedOrdersByTime = sortOrders(orders, sortBy);
  const handleSave = async () => {
    if (!editing) return;
    if (currentEditIndex === null) return;
    const dataOrder = dataOrders[currentEditIndex];
    const combineEditOrder = {
      ...dataOrder,
      final: editing,
    };
    const res = await updateOrder(dataOrder._id, combineEditOrder);
    // setOrders((prev) => prev.map((o) => (o.orderCode === editing.orderCode ? editing : o)));
    if (res?.status === "success") {
      setEditing({ ...defaultNewOrder });
      setCurrentEditIndex(null);
      alert("Update success");
      setShowEditingBox(false);
      setHasChangeData(true);
    } else {
      console.log("Editing failed");
    }
  };

  // handle checkbox change
  const toggleStatus = (status: string) => {
    if (status === "All") {
      setSelectedStatuses(["All"]);
    } else {
      setSelectedStatuses((prev) => {
        const newStatuses = prev.includes(status) ? prev.filter((s) => s !== status) : [...prev.filter((s) => s !== "All"), status];
        return newStatuses.length === 0 ? ["All"] : newStatuses;
      });
    }
  };

  // filter orders
  const filteredOrders = selectedStatuses.includes("All")
    ? sortedOrdersByTime
    : sortedOrdersByTime.filter((o) => selectedStatuses.some((s) => s.trim().toLowerCase() === o.status.trim().toLowerCase()));

  // Filter for "Chốt" status
  const filteredConfirmedOrders = deliveryStatuses === "All" ? filteredOrders : filteredOrders.filter((o) => o.deliveryStatus === deliveryStatuses);
  const [searchData, setSearchData] = useState<FinalOrder[]>(filteredConfirmedOrders);
  // Step 2: filter by search text
const finalData = !searchOrderCode
  ? filteredConfirmedOrders
  : filteredConfirmedOrders.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(searchOrderCode.toLowerCase()) ||
        (o.deliveryCode &&
          o.deliveryCode.toLowerCase().includes(searchOrderCode.toLowerCase()))
    );
  // useEffect(() => {
  //   if(dataOrders.length > 0){
  //           setSearchData([...filteredConfirmedOrders]);
  //   }
  // },[dataOrders])
  const handleFilterByOwnerId = (codeText: string) => {
    if (!codeText) return filteredConfirmedOrders;

    const lowerText = codeText.trim().toLowerCase();

    return filteredConfirmedOrders.filter(
      (o) => o.orderCode.toLowerCase().includes(lowerText) || (o.deliveryCode && o.deliveryCode.toLowerCase().includes(lowerText)) // in case you also want to match deliveryCode
    );
  };
  useEffect(() => {
    if (hasChangeData) {
      setSearchData([...filteredConfirmedOrders]);
      setHasChangeData(false);
    }
  }, [hasChangeData, filteredConfirmedOrders]);

  const handleSearchChange = (searchText: string) => {
    setSearchOrderCode(searchText || null);
    const filterByOwnerId = handleFilterByOwnerId(searchText);
    console.log("filterByOwnerId", filterByOwnerId);
    setSearchData(filterByOwnerId);
  };

  const countByStatus = () => {
    const counts: Record<string, number> = {};
    filteredConfirmedOrders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  };
  const statusCounts = countByStatus();
  const DeliveryStatusCounts = () => {
    const counts: Record<string, number> = {};
    filteredConfirmedOrders.forEach((o) => {
      counts[o.deliveryStatus] = (counts[o.deliveryStatus] || 0) + 1;
      if (o.deliveryStatus === "Chưa gửi hàng" && o.status === "Chốt") {
        {
          counts["Đã chốt"] = (counts["Đã chốt"] || 0) + 1;
        }
      }
    });
    return counts;
  };
  const DeliveryStatusCountsResult = DeliveryStatusCounts();

  const handleAddressChange_Old = (whatBox: "edit-form" | "new-form", addr: { provinceName: string; districtName: string; communeName: string }) => {
    setCurrentBuyerInfo({
      province: addr.provinceName,
      district: addr.districtName,
      commune: addr.communeName,
    });
  };

  useEffect(() => {
    if (!correctedAddress) return;

    const fullAddress = [correctedAddress, currentBuyerInfo.commune, currentBuyerInfo.district, currentBuyerInfo.province].filter(Boolean).join(", ");

    if (editing) {
      setEditing((prev) => (prev ? { ...prev, address: fullAddress } : prev));
    }
    if (newOrder) {
      setNewOrder((prev) => ({ ...prev, address: fullAddress }));
    }
  }, [correctedAddress, currentBuyerInfo]);

  const UpdateMultipleDeliveryStatus = async (newStatus: string) => {
    if (DeliveryStatusCountsResult["Đã chốt"] === 0) {
      alert("Không có đơn hàng nào để cập nhật. Vui lòng kiểm tra lại.");
      return;
    }
    if (newStatus === "Chưa gửi hàng") {
      alert("Vui lòng chọn trạng thái vận chuyển hợp lệ để cập nhật.");
      return;
    }

    const idsToUpdate = dataOrders
      .filter(
        (o) =>
          (o.final.status === "Chốt" && o.final.deliveryStatus === "Chưa gửi hàng") ||
          o.final.deliveryStatus === "Đang đóng hàng" ||
          o.final.deliveryStatus === "Đã gửi hàng"
      )
      .map((o) => o._id);

    if (idsToUpdate.length === 0) return;

    const res = await updateMultipleOrders(idsToUpdate, { deliveryStatus: newStatus });
    if (res?.status === "success") {
      alert("✅ Cập nhật trạng chuyển thành công");
    } else {
      alert("🚨 Cập nhật lỗi.");
    }
  };

  const handleCreateNewOrder = async () => {
    if (!newOrder) return;
    console.log("new", newOrder);

    if (!newOrder.customerName || !newOrder.phone || !newOrder.address || newOrder.orderInfo.length === 0 || newOrder.total <= 0) {
      alert("🚨 Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const localTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
    const newFinalForSend = {
      productId: productId,
      staffID: staffID,
      ...newOrder,
      time: localTime.toString(),
    };
    const res = await addOrder(newFinalForSend);

    if (res?.status === "success") {
      alert(" ✅ Tạo đơn hàng thành công!");
    } else {
      alert(" 🚨 Tạo đơn hàng lỗi.");
    }

    // setOrders((prev) => [newOrder, ...prev]);
    setNewOrder({ ...defaultNewOrder });
    setHasNewOrder(true);
    // setCorrectedAddress(null);
    // setCreateNewOrderBox(false);
  };

  useEffect(() => {
    if (hasNewOrder) {
      setSearchData([...filteredConfirmedOrders]);
      setHasNewOrder(false);
    }
  }, [hasNewOrder]);
  const handleNumberProduct = (action: "decrease" | "increase", index: number) => {
    const newCart = [...virtualCart];
    if (action === "increase") {
      if (newCart[index].quantity + 1 > newCart[index].stock) {
        // 🚨 exceed stock
        setIsExceedStock(index);
        return; // stop increasing
      }
      if (newCart[index].quantity === 0) {
        newCart[index].isSelected = true;
      }
      newCart[index].quantity += 1;

      setVirtualCart(newCart);
    }
    if (action === "decrease") {
      if (typeof isExceedStock === "number") {
        setIsExceedStock(null);
      }
      if (newCart[index].quantity === 0) {
        // setNotify2("Ít nhất là 1 sản phẩm")
        return;
      } else {
        newCart[index].quantity = newCart[index].quantity - 1;
        if (newCart[index].quantity < 0) {
          newCart[index].quantity === 0;
        }
        if (newCart[index].quantity === 0) {
          newCart[index].isSelected = false;
        }
        setVirtualCart(newCart);
      }
    }
  };

  const handleCartChange = (value: boolean, index: number) => {
    const newCart = [...virtualCart];

    newCart[index].isSelected = value;
    if (newCart[index].quantity === 0 && value) {
      newCart[index].quantity = 1;
    }
    if (newCart[index].quantity !== 0 && value === false) {
      newCart[index].quantity = 0;
    }
    setVirtualCart(newCart);
  };

  const handleCloseAddProduct = (whatBox: "new-form" | "edit-form") => {
    const selectOrder = virtualCart.filter((item) => item.isSelected === true);
    const orders = selectOrder.map((cart) => {
      return {
        name: cart.name,
        color: cart.color,
        size: cart.size,
        quantity: cart.quantity,
        weight: cart.weight,
        price: cart.price,
      };
    });

    const totals = {
      totalPayment: 0,
      totalQuantity: 0,
      totalWeight: 0,
    };

    selectOrder.forEach((item) => {
      totals.totalQuantity += item.quantity;
      totals.totalWeight += item.quantity * item.weight;
      totals.totalPayment += item.quantity * item.price;
    });
    if (whatBox === "new-form") {
      setNewOrder((prev) => {
        return { ...prev, orderInfo: [...orders], total: totals.totalPayment, totalProduct: totals.totalQuantity, totalWeight: totals.totalWeight };
      });
    }
    if (whatBox === "edit-form") {
      setEditing((prev) => {
        return { ...prev, orderInfo: [...orders], total: totals.totalPayment, totalProduct: totals.totalQuantity, totalWeight: totals.totalWeight };
      });
    }
    setShowListProduct(false);
  };

  const handleUploadOrderExcel = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const nameFile = file.name;

    const result = await uploadOrdersExcel(file);
    if (result.status === "success") {
      alert(`✅ Uploaded ${result.count} orders successfully`);
    }
    setShowUploadExcel(false);
    // alert(`✅ Uploaded ${data.count} costs`);
  };

  const handleUploadOrders = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const [copied, setCopied] = useState(false);
  const [copyIndex, setCopyIndex] = useState<number | null>(null);
  const handleCopyOrderCode = async (orderCode: string, i: number) => {
    try {
      await navigator.clipboard.writeText(orderCode);
      setCopied(true);
      setCopyIndex(i);
      setTimeout(() => setCopied(false), 2000); // hide after 2s
      console.log("Text copied to clipboard:", orderCode);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDeleteOrder = async (orderCode: string) => {
    const orderRootData = dataOrders.find((item) => item.orderCode === orderCode);
    const idOrder = orderRootData?._id;
    if (!idOrder) return alert("Do not find the order by order code.");
    let userChoice = confirm("Are you sure you want to delete?");

    if (!userChoice) return;
    const res = await deleteOrder(idOrder);
    if (res?.status === "success") {
      alert("Delete success!");
      setHasDeleteOrder(true);
    } else {
      alert("Detele failed!");
    }
  };
  useEffect(() => {
    if (hasDeleteOrder) {
      setSearchData([...filteredConfirmedOrders]);
      setHasDeleteOrder(false);
    }
  }, [hasDeleteOrder]);

  return (
    <div className={cx("landing-orders-main")}>
      <div className={cx("user-page")}>
        <StaffTracking staffID={staffID} />
        <NavLink key="user-page" to={`/ho-so-ca-nhan`} style={{ textDecoration: "none" }}>
          {/* {user?.email || "None"} */}
          Hồ sơ cá nhân
        </NavLink>
        <div onClick={() => handleLogout()}>Đăng xuất</div>
      </div>
      <div className={cx("horizontal-decor")}>
        <GiDividedSquare />
        <div className={cx("horizontal-line")}></div>
        <div className={cx("group-diamon")}>
          <GiDividedSquare />
          <GiDividedSquare />
          <GiDividedSquare />
        </div>
        <div className={cx("horizontal-line")}></div>
        <GiDividedSquare />
      </div>
      <div className={cx("view-mode-toggle")}>
        <button className={cx(viewMode === "table" ? "active" : "")} onClick={() => setViewMode("table")}>
          Danh sách đơn hàng
        </button>
        <button className={cx(viewMode === "excel" ? "active" : "")} onClick={() => setViewMode("excel")}>
          Tạo Excel
        </button>
      </div>
      {viewMode === "table" && (
        <div>
          <div>
            <button className={cx("btn-decor")} onClick={() => setSortBy("latest")}>
              Đơn mới nhất
            </button>
            <button className={cx("btn-decor")} onClick={() => setSortBy("oldest")}>
              Đơn cũ nhất
            </button>
            <button className={cx("btn-decor")} onClick={() => setOpenUpdateDeliveryBox(true)}>
              Cập nhật vận chuyển hàng loạt
            </button>
            <button className={cx("btn-decor")} onClick={() => setCreateNewOrderBox(true)}>
              Tạo đơn hàng mới
            </button>
            <button className={cx("btn-decor")} onClick={() => setShowUploadExcel(true)}>
              Tải excel
            </button>
          </div>
          <div className={cx("filters")}>
            <div className={cx("filter-checkbox")}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("All")}
                  onChange={() => {
                    toggleStatus("All");
                    setDeliveryStatuses("All");
                  }}
                />
                Tất cả
              </label>
              {STATUS_OPTIONS.map((status) => (
                <label key={status}>
                  <input type="checkbox" checked={selectedStatuses.includes(status)} onChange={() => toggleStatus(status)} />
                  <span>{status} - </span>
                  <span style={{ color: "red", fontWeight: 600 }}>{statusCounts[status]}</span>
                  {status === "Chốt" && selectedStatuses.includes(status) && (
                    <select value={deliveryStatuses} onChange={(e) => setDeliveryStatuses(e.target.value)}>
                      <option value="All">Tất cả</option>
                      {DeliveryOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              ))}
            </div>
            <div>
              <span>Tìm kiếm &nbsp;</span>
              <input
                type="text"
                placeholder="Nhập mã đơn shop hoặc nhập mã đơn nhà vận chuyển"
                className={cx("input-search")}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className={cx("table-wrapper")}>
            <table className={cx("orders-table")}>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Mã đơn</th>
                  <th>Trạng thái</th>
                  <th>Tên khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>
                    {/* <div>Thông tin đơn hàng</div> */}
                    <div>Sản phẩm - Màu - Size - Số lượng</div>
                  </th>
                  <th>Tổng tiền</th>
                  <th>Ghi chú</th>

                  <th>Vận chuyển</th>
                  <th>Nhân viên</th>
                  <th>Sửa</th>
                  {/* <th>IP</th> */}
                  <th>Nguồn</th>
                </tr>
              </thead>
              <tbody>
                {finalData.map((o, i) => {
                  let statusClass = "";

                  if (o.status === "Chốt") statusClass = "status-done";
                  else if (o.status === "Chưa gọi điện") statusClass = "status-pending";
                  else if (o.status === "Không liên lạc được lần 1" || o.status === "Không liên lạc được lần 2" || o.status === "Không liên lạc được lần 3")
                    statusClass = "status-retry";
                  else if (o.status === "Khách không mua") statusClass = "status-cancel";
                  else if (o.status === "Đơn mới") statusClass = "status-new-order";

                  let deliveryClass = "";
                  if (o.deliveryStatus === "Giao thành công") deliveryClass = "text-status-done";
                  else if (o.deliveryStatus === "Chưa gửi hàng") deliveryClass = "text-status-pending";
                  else if (o.deliveryStatus === "Giao thất bại") deliveryClass = "text-status-cancel";
                  else if (o.deliveryStatus === "Đang giao hàng") deliveryClass = "text-status-retry";
                  else if (o.deliveryStatus === "Đã gửi hàng") deliveryClass = "text-status-info";
                  else if (o.deliveryStatus === "Đang đóng hàng") deliveryClass = "text-status-packing";
                  return (
                    <tr key={o.orderCode} className={cx("row")}>
                      <td>{o.time}</td>
                      {/* <td>{o.orderCode} <IoIosCopy style={{cursor: "pointer"}} onClick={() => hanleCopyOrderCode(o.orderCode)}/></td> */}
                      <td style={{ position: "relative" }}>
                        {o.orderCode} <IoIosCopy style={{ cursor: "pointer" }} onClick={() => handleCopyOrderCode(o.orderCode, i)} />
                        {copied && copyIndex === i && (
                          <span className={cx("copied-text")} key={`copy-${i}`}>
                            Đã sao chép
                          </span>
                        )}
                      </td>
                      <td className={cx(statusClass)}>{o.status}</td>
                      <td className={cx(statusClass)}>{o.customerName}</td>
                      <td className={cx(statusClass)}>{formatPhone(o.phone)}</td>
                      <td>{o.address}</td>
                      <td className={cx("order-info-cell")}>
                        {o.orderInfo.map((item, idx) => (
                          <div key={idx} className={cx("order-item")}>
                            {item.name} - {item.color} - {item.size} - x<span style={{ fontSize: 18, fontWeight: 550 }}>{item.quantity}</span>
                          </div>
                        ))}
                      </td>
                      <td>{o.total.toLocaleString()}₫</td>
                      <td>{o.note}</td>

                      {/* <td>{o.confirmed ? "✅" : "❌"}</td> */}
                      <td className={cx(deliveryClass)} style={{ verticalAlign: "middle" }}>
                        {o.deliveryStatus}
                        {o.deliveryStatus === "Đang giao hàng" && (
                          <img src={deliveryTruck} alt="Đang giao" style={{ width: "35px", verticalAlign: "middle" }} />
                        )}
                        {o.deliveryStatus === "Giao thành công" && <img src={atm} alt="Đã giao" style={{ width: "25px", verticalAlign: "middle" }} />}
                        {o.deliveryStatus === "Giao thất bại" && <img src={dislike} alt="Giao thất bại" style={{ width: "30px", verticalAlign: "middle" }} />}
                        {o.deliveryStatus === "Chưa gửi hàng" && <img src={hourglass} alt="Chưa gửi" style={{ width: "28px", verticalAlign: "middle" }} />}
                        {o.deliveryStatus === "Đang đóng hàng" && (
                          <img src={conveyorBelt} alt="Đang đóng hàng" style={{ width: "28px", verticalAlign: "middle", marginLeft: 3 }} />
                        )}
                        {o.deliveryStatus === "Khách chưa chốt" && (
                          <img src={phone} alt="Khách chưa chốt" style={{ width: "28px", verticalAlign: "middle", marginLeft: 3 }} />
                        )}
                        {o.deliveryStatus === "Đang hết hàng" && (
                          <img src={outOfStock} alt="Đang hết hàng" style={{ width: "28px", verticalAlign: "middle", marginLeft: 3 }} />
                        )}
                        {o.deliveryStatus === "Đã gửi hàng" && (
                          <img src={courier} alt="Đã gửi hàng" style={{ width: "28px", verticalAlign: "middle", marginLeft: 3 }} />
                        )}
                      </td>
                      <td>{o.staff}</td>
                      <td className={cx("group-action")}>
                        <button
                          className={cx("edit-btn")}
                          onClick={() => {
                            console.log("edit ", o);
                            setEditing(o);
                            setOriginOrder(serverOriginalOrderData[i]);
                            const currentOrders = o.orderInfo;
                            setVirtualCart(
                              defaultVirtualCart.map((item) => {
                                const sameProduct = currentOrders.find((order) => order.color === item.color && order.size === item.size);
                                return sameProduct
                                  ? { ...item, isSelected: true, quantity: sameProduct.quantity }
                                  : { ...item, isSelected: false, quantity: 0 };
                              })
                            );

                            setCurrentEditIndex(i);
                            setShowEditingBox(true);
                          }}
                        >
                          {/* ✏️ */}
                          <MdModeEditOutline size={22} color="#1175e7" />
                        </button>
                        {staffRole === "admin" && (
                          <button onClick={() => handleDeleteOrder(o.orderCode)}>
                            <MdDelete color="red" size={22} style={{ marginLeft: 10 }} />
                          </button>
                        )}
                      </td>
                      {/* <td>{o.buyerIP}</td> */}
                      <td>{o.website}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* //--Edit Modal */}
          {showEditingBox && originOrder && (
            <div className={cx("fullfilment-bg")}>
              <div className={cx("modal-overlay")}>
                <div className={cx("modal-original")}>
                  <h2>Thông tin gốc</h2>
                  <div className={cx("form")}>
                    <div className={cx("group-item")}>
                      <label>
                        Tên khách hàng:
                        <input disabled value={originOrder.customerName} />
                      </label>
                      <label>
                        Số điện thoại:
                        <input disabled value={formatPhone(originOrder.phone)} />
                      </label>
                    </div>

                    <label>
                      Địa chỉ:
                      <input disabled value={originOrder.address} />
                    </label>
                    {/* Order Info (array of products) */}
                    <div className={cx("order-info-edit")}>
                      <h3>Thông tin sản phẩm</h3>
                      <div className={cx("order-item-row")}>
                        <div className={cx("input-1", "header")}>Tên sản phẩm</div>
                        <div className={cx("input-2", "header")}>Màu</div>
                        <div className={cx("input-3", "header")}>Size</div>
                        <div className={cx("input-4", "header")}>Gía</div>
                        <div className={cx("input-4", "header")}>Số lượng</div>
                      </div>
                      {originOrder.orderInfo.map((item, index) => {
                        return (
                          <div key={index} className={cx("order-item-row")}>
                            <div className={cx("input-1")}>{item.name}</div>
                            <div className={cx("input-2")}>
                              <span className={cx("color-identification")} style={{ backgroundColor: COLORS[item.color.toLowerCase()] }} />
                              {item.color}
                            </div>
                            <div className={cx("input-3")}>{item.size}</div>
                            <div className={cx("input-4")}>{item.price.toLocaleString("vi-VN")}₫</div>
                            <div className={cx("input-4")}>{item.quantity}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={cx("btn-total-add")}>
                      <div></div>
                      <label style={{ fontWeight: "550", fontSize: "17px", textAlign: "right", color: "#ff0958" }}>
                        Tổng tiền {`( ${originOrder.totalProduct} sản phẩm)`}:&nbsp; {Number(originOrder.total).toLocaleString()} ₫
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Ghi chú:
                        <input disabled value={originOrder.note} />
                      </label>
                      <label>
                        Nguồn:
                        <input
                          value={editing.website}
                          onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                          placeholder="link website hoặc link facebook khách..."
                          disabled
                        />
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Nhân viên:
                        <select value={originOrder.staff} disabled>
                          {staffName.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                <div className={cx("modal")}>
                  <h2>Sửa đơn hàng</h2>
                  <div className={cx("form")}>
                    <div className={cx("group-item")}>
                      <label>
                        Tên khách hàng:
                        <input value={editing.customerName} onChange={(e) => setEditing({ ...editing, customerName: e.target.value })} />
                      </label>
                      <label>
                        Số điện thoại:
                        <input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} disabled />
                      </label>
                    </div>

                    <div className={cx("address-edit-group")}>
                      <label>
                        <div style={{ marginBottom: 10 }}>
                          Địa chỉ: <span style={{ fontSize: 14, fontWeight: 500, color: "#e94343" }}>{editing.address}</span>
                        </div>
                        <input
                          value={correctedAddress === null ? editing.address : correctedAddress}
                          onChange={(e) => setCorrectedAddress(e.target.value)}
                          placeholder="Số nhà, tên đường hoặc tên tòa nhà..."
                        />
                      </label>
                      <VnAddressSelect_Old onChange={(addr) => handleAddressChange_Old("edit-form", addr)} />
                    </div>

                    {/* Order Info (array of products) */}
                    <div className={cx("order-info-edit")}>
                      <h3>Thông tin sản phẩm</h3>
                      <div className={cx("order-item-row")}>
                        <div className={cx("input-1", "header")}>Tên sản phẩm</div>
                        <div className={cx("input-2", "header")}>Màu</div>
                        <div className={cx("input-3", "header")}>Size</div>
                        <div className={cx("input-4", "header")}>Gía</div>
                        <div className={cx("input-4", "header")}>Số lượng</div>
                      </div>
                      {editing.orderInfo.map((item, index) => {
                        return (
                          <div key={index} className={cx("order-item-row")}>
                            <div className={cx("input-1")}>{item.name}</div>
                            <div className={cx("input-2")}>
                              <span className={cx("color-identification")} style={{ backgroundColor: COLORS[item.color.toLowerCase()] }} />
                              {item.color}
                            </div>
                            <div className={cx("input-3")}>{item.size}</div>
                            <div className={cx("input-4")}>{item.price.toLocaleString("vi-VN")}₫</div>
                            <div className={cx("input-4")}>{item.quantity}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={cx("btn-total-add")}>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowListProduct(true);
                            console.log("hello");
                          }}
                        >
                          + Thêm sản phẩm
                        </button>
                      </div>
                      <label style={{ fontWeight: "550", fontSize: "17px", textAlign: "right", color: "#ff0958" }}>
                        Tổng tiền {`( ${editing.totalProduct} sản phẩm)`}:&nbsp; {Number(editing.total).toLocaleString()} ₫
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Trạng thái:
                        <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Vận chuyển:
                        <select value={editing.deliveryStatus} onChange={(e) => setEditing({ ...editing, deliveryStatus: e.target.value })}>
                          {DeliveryOptionsForStaffSelectManual.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Ghi chú:
                        <input value={editing.note} onChange={(e) => setEditing({ ...editing, note: e.target.value })} />
                      </label>
                      <label>
                        Nhân viên:
                        <select value={editing.staff} onChange={(e) => setEditing({ ...editing, staff: e.target.value })}>
                          {/* <option value="Không">Không tên</option> */}
                          {staffName.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Nguồn:
                        <input
                          value={editing.website}
                          onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                          placeholder="link website hoặc tên shop..."
                        />
                      </label>
                      <label>
                        Facebook khách:
                        <input
                          value={editing.facebookLink || ""}
                          onChange={(e) => setEditing({ ...editing, facebookLink: e.target.value })}
                          placeholder="link facebook khách..."
                        />
                      </label>
                    </div>
                  </div>

                  <div className={cx("modal-actions")}>
                    <button
                      onClick={() => {
                        setEditing({ ...defaultNewOrder });
                        setCorrectedAddress(null);
                        setVirtualCart([...defaultVirtualCart]);
                        setShowListProduct(false);
                        setShowEditingBox(false);
                      }}
                    >
                      Hủy
                    </button>
                    <button onClick={handleSave}>Lưu</button>
                  </div>
                </div>
                {showListProduct && (
                  <div className={cx("show-list-product")}>
                    <h4>Chọn sản phẩm theo màu, size</h4>
                    <div className={cx("filter-color-container")}>
                      <div style={{ fontWeight: 550 }}>Lọc theo màu:</div>
                      <div className={cx("wrap-checkbox")}>
                        {productDetail.colorAvailable.map((color, k) => {
                          const isChecked = filterColorInAddProduct === color;
                          return (
                            <div key={k}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (isChecked) {
                                    // ✅ if clicking again on the same box → reset to "None"
                                    setFilterColorInAddProduct("None");
                                  } else {
                                    // ✅ else → select this color (unchecking others automatically)
                                    setFilterColorInAddProduct(color);
                                  }
                                }}
                              />
                              <span>{color}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className={cx("row")}>
                      <div>Chọn</div>
                      <div>Tên</div>
                      <div>Màu</div>
                      <div>Size</div>
                      <div>Giá</div>
                      <div>Kho</div>
                      <div>Số lượng</div>
                    </div>
                    {/* {virtualCart.map((p, i) => {
                      return (
                        <React.Fragment>
                          {filterColorInAddProduct === "None" ? (
                            <div key={i} className={cx("row")}>
                              <div>
                                <input
                                  checked={p.isSelected}
                                  type="checkbox"
                                  style={{ cursor: "pointer", width: 18, height: 18, borderRadius: 9 }}
                                  onChange={(e) => handleCartChange(e.target.checked, i)}
                                />
                              </div>
                              <div style={{ fontWeight: 550 }}>{p.name}</div>
                              <div className={cx("column-3")}>
                                <span className={cx("color-identification")} style={{ backgroundColor: COLORS[p.color.toLowerCase()] }} />
                                {p.color}
                              </div>
                              <div>{p.size}</div>
                              <div>{p.price.toLocaleString("vi-VN")} đ</div>
                              <div>{p.stock}</div>
                              <div className={cx("choose-quantity")}>
                                <div onClick={() => handleNumberProduct("decrease", i)} className={cx("decrease")}>
                                  <HiMinusSmall color="black" />
                                </div>
                                <div className={cx("vertical-line")}>|</div>

                                <div style={{ color: "black", fontSize: "18px" }} className={cx("quantity-number")}>
                                  &nbsp; {p.quantity} &nbsp;
                                </div>
                                <div className={cx("vertical-line")}>|</div>
                                <div onClick={() => handleNumberProduct("increase", i)} className={cx("increase")}>
                                  <HiPlusSmall color="black" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            p.color === filterColorInAddProduct && (
                              <div key={i} className={cx("row")}>
                                <div>
                                  <input
                                    checked={p.isSelected}
                                    type="checkbox"
                                    style={{ cursor: "pointer", width: 18, height: 18, borderRadius: 9 }}
                                    onChange={(e) => handleCartChange(e.target.checked, i)}
                                  />
                                </div>
                                <div style={{ fontWeight: 550 }}>{p.name}</div>
                                <div className={cx("column-3")}>
                                  <span className={cx("color-identification")} style={{ backgroundColor: COLORS[p.color.toLowerCase()] }} />
                                  {p.color}
                                </div>
                                <div>{p.size}</div>
                                <div>{p.price.toLocaleString("vi-VN")} đ</div>
                                <div>{p.stock}</div>
                                <div className={cx("choose-quantity")}>
                                  <div onClick={() => handleNumberProduct("decrease", i)} className={cx("decrease")}>
                                    <HiMinusSmall color="black" /> &nbsp;
                                  </div>
                                  <div className={cx("vertical-line")}>|</div>

                                  <div style={{ color: "black", fontSize: "18px" }}>&nbsp; {p.quantity} &nbsp;</div>
                                  <div className={cx("vertical-line")}>|</div>
                                  <div onClick={() => handleNumberProduct("increase", i)} className={cx("increase")}>
                                    {" "}
                                    &nbsp;
                                    <HiPlusSmall color="black" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </React.Fragment>
                      );
                    })} */}
                    {virtualCart.map((p, i) => (
                      <React.Fragment key={i}>
                        {isExceedStock === i && <div className={cx("warning")}>⚠️ Số lượng vượt quá tồn kho ({p.stock})</div>}
                        {filterColorInAddProduct === "None" || p.color === filterColorInAddProduct ? (
                          <div className={cx("row")}>
                            <div>
                              <input
                                checked={p.isSelected}
                                type="checkbox"
                                style={{ cursor: "pointer", width: 18, height: 18, borderRadius: 9 }}
                                onChange={(e) => handleCartChange(e.target.checked, i)}
                              />
                            </div>
                            <div style={{ fontWeight: 550 }}>{p.name}</div>
                            <div className={cx("column-3")}>
                              <span className={cx("color-identification")} style={{ backgroundColor: COLORS[p.color.toLowerCase()] }} />
                              {p.color}
                            </div>
                            <div>{p.size}</div>
                            <div>{p.price.toLocaleString("vi-VN")} đ</div>
                            <div>{p.stock}</div>
                            <div className={cx("choose-quantity")}>
                              <div onClick={() => handleNumberProduct("decrease", i)} className={cx("decrease")}>
                                <HiMinusSmall color="black" />
                              </div>
                              <div className={cx("vertical-line")}>|</div>
                              <div style={{ color: "black", fontSize: "18px" }} className={cx("quantity-number")}>
                                {p.quantity}
                              </div>
                              <div className={cx("vertical-line")}>|</div>
                              <div onClick={() => handleNumberProduct("increase", i)} className={cx("increase")}>
                                <HiPlusSmall color="black" />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </React.Fragment>
                    ))}

                    <div style={{ textAlign: "center", marginTop: 20 }}>
                      <button className={cx("btn-decor", "btn-close")} onClick={() => handleCloseAddProduct("edit-form")}>
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* //--Update multiple delivery status order */}
          {openUpdateDeliveryBox && (
            <div className={cx("update-delivery-box")}>
              <h4>Cập nhật tất cả đơn đã chốt - Chưa giao hàng</h4>
              <div>
                Đã chốt - Chưa gửi hàng: <span style={{ color: "red", fontWeight: 600 }}>{DeliveryStatusCountsResult["Đã chốt"]}</span>
              </div>
              <div>
                <label style={{ marginRight: 10 }}>Trạng thái vận chuyển mới:</label>
                <select value={selectedDeliveryStatusForUpdate} onChange={(e) => setSelectedDeliveryStatusForUpdate(e.target.value)}>
                  {DeliveryOptionsForStaffSelectManual.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 10 }}>Lưu ý: Chỉ cập nhật những đơn có trạng thái vận chuyển là "Chưa gửi hàng"</div>
              <div>
                <button className={cx("cancel")} onClick={() => setOpenUpdateDeliveryBox(false)}>
                  Đóng
                </button>
                <button className={cx("update")} onClick={() => UpdateMultipleDeliveryStatus(selectedDeliveryStatusForUpdate)}>
                  Cập nhật
                </button>
              </div>
            </div>
          )}

          {/* //-- Create new order */}
          {createNewOrderBox && newOrder && (
            <div className={cx("fullfilment-bg")}>
              <div className={cx("modal-overlay")}>
                <div className={cx("modal")}>
                  <h2>Tạo đơn hàng mới</h2>
                  <div className={cx("form")}>
                    <div className={cx("group-item")}>
                      <label>
                        Tên khách hàng:
                        <input value={newOrder.customerName} onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })} />
                      </label>
                      <label>
                        Số điện thoại:
                        <input value={newOrder.phone} onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })} />
                      </label>
                    </div>

                    <div className={cx("address-edit-group")}>
                      <label>
                        <div style={{ marginBottom: 10 }}>
                          Địa chỉ: <span style={{ fontSize: 14, fontWeight: 500, color: "#e94343" }}>{newOrder.address}</span>
                        </div>
                        <input
                          value={correctedAddress === null ? newOrder.address : correctedAddress}
                          onChange={(e) => setCorrectedAddress(e.target.value)}
                          placeholder="Số nhà, tên đường hoặc tên tòa nhà..."
                        />
                      </label>
                      <VnAddressSelect_Old onChange={(addr) => handleAddressChange_Old("new-form", addr)} />
                    </div>
                    {/* Order Info (array of products) */}
                    <div className={cx("order-info-edit")}>
                      <h3>Thông tin sản phẩm</h3>
                      <div className={cx("order-item-row")}>
                        <div className={cx("input-1")}>Tên sản phẩm</div>
                        <div className={cx("input-2")}>Màu</div>
                        <div className={cx("input-3")}>Size</div>
                        <div className={cx("input-4")}>Gía</div>
                        <div className={cx("input-4")}>Số lượng</div>
                      </div>
                      {newOrder.orderInfo.map((item, index) => {
                        return (
                          <div key={index} className={cx("order-item-row")}>
                            <div className={cx("input-1")}>{item.name}</div>
                            <div className={cx("input-2")}>
                              <span className={cx("color-identification")} style={{ backgroundColor: COLORS[item.color.toLowerCase()] }} />
                              {item.color}
                            </div>
                            <div className={cx("input-3")}>{item.size}</div>
                            <div className={cx("input-4")}>{item.price.toLocaleString("vi-VN")}₫</div>
                            <div className={cx("input-4")}>{item.quantity}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className={cx("btn-total-add")}>
                      <div>
                        <button type="button" onClick={() => setShowListProduct(true)}>
                          + Thêm sản phẩm
                        </button>
                      </div>
                      <label style={{ fontWeight: "550", fontSize: "17px", textAlign: "right", color: "#ff0958" }}>
                        Tổng tiền {`( ${newOrder.totalProduct} sản phẩm)`}:&nbsp; {Number(newOrder.total).toLocaleString()} ₫
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Ghi chú:
                        <input value={newOrder.note} onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })} />
                      </label>
                      <label>
                        Vận chuyển:
                        <select value={newOrder.deliveryStatus} onChange={(e) => setNewOrder({ ...newOrder, deliveryStatus: e.target.value })}>
                          {DeliveryOptionsForStaffSelectManual.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Trạng thái:
                        <select value={newOrder.status} onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Nhân viên:
                        <select value={newOrder.staff} onChange={(e) => setNewOrder({ ...newOrder, staff: e.target.value })}>
                          {staffName.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className={cx("group-item")}>
                      <label>
                        Nguồn:
                        <input
                          value={newOrder.website}
                          onChange={(e) => setNewOrder({ ...newOrder, website: e.target.value })}
                          placeholder="link website hoặc tên shop..."
                        />
                      </label>
                      <label>
                        Facebook khách:
                        <input
                          value={newOrder.facebookLink || ""}
                          onChange={(e) => setNewOrder({ ...newOrder, facebookLink: e.target.value })}
                          placeholder="link facebook khách..."
                        />
                      </label>
                    </div>
                  </div>
                  <div className={cx("modal-actions")}>
                    <button
                      onClick={() => {
                        setCreateNewOrderBox(false);
                        setCorrectedAddress(null);
                        setVirtualCart([...defaultVirtualCart]);
                        setNewOrder({ ...defaultNewOrder });
                      }}
                    >
                      Đóng
                    </button>
                    <button onClick={handleCreateNewOrder}>Tạo đơn</button>
                  </div>
                </div>
                {showListProduct && (
                  <div className={cx("show-list-product")}>
                    <h4>Chọn sản phẩm theo màu size</h4>
                    <div className={cx("filter-color-container")}>
                      <div style={{ fontWeight: 550 }}>Lọc theo màu:</div>
                      <div className={cx("wrap-checkbox")}>
                        {productDetail.colorAvailable.map((color, k) => {
                          const isChecked = filterColorInAddProduct === color;
                          return (
                            <div key={k}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (isChecked) {
                                    // ✅ if clicking again on the same box → reset to "None"
                                    setFilterColorInAddProduct("None");
                                  } else {
                                    // ✅ else → select this color (unchecking others automatically)
                                    setFilterColorInAddProduct(color);
                                  }
                                }}
                              />
                              <span>{color}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className={cx("row")}>
                      <div>Chọn</div>
                      <div>Tên</div>
                      <div>Màu</div>
                      <div>Size</div>
                      <div>Giá</div>
                      <div>Kho</div>
                      <div>Số lượng</div>
                    </div>
                    {/* {virtualCart.map((p, i) => {
                      return (
                        <React.Fragment>
                          {filterColorInAddProduct === "None" ? (
                            <div key={i} className={cx("row")}>
                              <div>
                                <input
                                  checked={p.isSelected}
                                  type="checkbox"
                                  style={{ cursor: "pointer", width: 18, height: 18, borderRadius: 9 }}
                                  onChange={(e) => handleCartChange(e.target.checked, i)}
                                />
                              </div>
                              <div style={{ fontWeight: 550 }}>{p.name}</div>
                              <div className={cx("column-3")}>
                                <span className={cx("color-identification")} style={{ backgroundColor: COLORS[p.color.toLowerCase()] }} />
                                {p.color}
                              </div>
                              <div>{p.size}</div>
                              <div>{p.price.toLocaleString("vi-VN")} đ</div>
                              <div>{p.stock}</div>
                              <div className={cx("choose-quantity")}>
                                <div onClick={() => handleNumberProduct("decrease", i)} className={cx("decrease")}>
                                  <HiMinusSmall color="black" />
                                </div>
                                <div className={cx("vertical-line")}>|</div>

                                <div style={{ color: "black", fontSize: "18px" }} className={cx("quantity-number")}>
                                  &nbsp; {p.quantity} &nbsp;
                                </div>
                                <div className={cx("vertical-line")}>|</div>
                                <div onClick={() => handleNumberProduct("increase", i)} className={cx("increase")}>
                                  {" "}
                                  <HiPlusSmall color="black" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            p.color === filterColorInAddProduct && (
                              <div key={i} className={cx("row")}>
                                <div>
                                  <input
                                    checked={p.isSelected}
                                    type="checkbox"
                                    style={{ cursor: "pointer", width: 18, height: 18, borderRadius: 9 }}
                                    onChange={(e) => handleCartChange(e.target.checked, i)}
                                  />
                                </div>
                                <div style={{ fontWeight: 550 }}>{p.name}</div>
                                <div className={cx("column-3")}>
                                  <span className={cx("color-identification")} style={{ backgroundColor: COLORS[p.color.toLowerCase()] }} />
                                  {p.color}
                                </div>
                                <div>{p.size}</div>
                                <div>{p.price.toLocaleString("vi-VN")} đ</div>
                                <div>{p.stock}</div>
                                <div className={cx("choose-quantity")}>
                                  <div onClick={() => handleNumberProduct("decrease", i)} className={cx("decrease")}>
                                    <HiMinusSmall color="black" /> &nbsp;
                                  </div>
                                  <div className={cx("vertical-line")}>|</div>

                                  <div style={{ color: "black", fontSize: "18px" }}>&nbsp; {p.quantity} &nbsp;</div>
                                  <div className={cx("vertical-line")}>|</div>
                                  <div onClick={() => handleNumberProduct("increase", i)} className={cx("increase")}>
                                    {" "}
                                    &nbsp;
                                    <HiPlusSmall color="black" />
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </React.Fragment>
                      );
                    })} */}
                    {virtualCart.map((p, i) => (
                      <React.Fragment key={i}>
                        {isExceedStock === i && <div className={cx("warning")}>⚠️ Số lượng vượt quá tồn kho ({p.stock})</div>}
                        {filterColorInAddProduct === "None" || p.color === filterColorInAddProduct ? (
                          <div className={cx("row")}>
                            <div>
                              <input
                                checked={p.isSelected}
                                type="checkbox"
                                style={{ cursor: "pointer", width: 18, height: 18, borderRadius: 9 }}
                                onChange={(e) => handleCartChange(e.target.checked, i)}
                              />
                            </div>
                            <div style={{ fontWeight: 550 }}>{p.name}</div>
                            <div className={cx("column-3")}>
                              <span className={cx("color-identification")} style={{ backgroundColor: COLORS[p.color.toLowerCase()] }} />
                              {p.color}
                            </div>
                            <div>{p.size}</div>
                            <div>{p.price.toLocaleString("vi-VN")} đ</div>
                            <div>{p.stock}</div>
                            <div className={cx("choose-quantity")}>
                              <div onClick={() => handleNumberProduct("decrease", i)} className={cx("decrease")}>
                                <HiMinusSmall color="black" />
                              </div>
                              <div className={cx("vertical-line")}>|</div>
                              <div style={{ color: "black", fontSize: "18px" }} className={cx("quantity-number")}>
                                {p.quantity}
                              </div>
                              <div className={cx("vertical-line")}>|</div>
                              <div onClick={() => handleNumberProduct("increase", i)} className={cx("increase")}>
                                <HiPlusSmall color="black" />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </React.Fragment>
                    ))}

                    <div style={{ textAlign: "center", marginTop: 20 }}>
                      <button className={cx("btn-decor", "btn-close")} onClick={() => handleCloseAddProduct("new-form")}>
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* //-- Upload excel */}
          {showUploadExcel && <UploadExcelBox onClose={() => setShowUploadExcel(false)} onUpload={handleUploadOrderExcel} />}
        </div>
      )}
      {viewMode === "excel" && <CreateExcel orders={filteredOrders} />}
    </div>
  );
}

export function sortOrders(data: FinalOrder[], sortBy: SortOrder): FinalOrder[] {
  return [...data].sort((a, b) => {
    const timeA = new Date(a.time).getTime();
    const timeB = new Date(b.time).getTime();

    if (sortBy === "latest") {
      return timeB - timeA; // newest first
    } else {
      return timeA - timeB; // oldest first
    }
  });
}
export function formatPhone(phone: string): string {
  // Remove all non-digit characters just in case
  const digits = phone.replace(/\D/g, "");

  // Format: 4 digits . 3 digits . 3 digits
  return digits.replace(/(\d{4})(\d{3})(\d{3})/, "$1.$2.$3");
}
function convertToNumber(value: string) {
  // remove all non-digits (and also the dot used as thousands separator)
  let cleaned = value.replace(/[^\d]/g, "");
  return Number(cleaned);
}

// console.log(convertToNumber("179.000 đ")); // 👉 179000
// console.log(convertToNumber("200,500 VND")); // 👉 200500
// console.log(convertToNumber("99.999"));      // 👉 99999
