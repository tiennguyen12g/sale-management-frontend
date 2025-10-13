import { create } from "zustand";
import axios from "axios";
import { GetShopOrders_API, AddShopOrders_API } from "../configs/api";
import { useAuthStore } from "./authStore";
import axiosApiCall from "./axiosApiClient";
// ---------- Types ----------
export interface OrderItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface DeliveryDetails {
  carrierCode: string; // B:10
  orderCode: string; //C:10
  sendTime: string; //D:10
  whoPayShipingFee: string; //V:10
  deliveryStatus: string; //AG:10
  totalFeeAndVAT: number; // Z:10
  receivedCOD: string; //AI:10
  timeForChangeStatus: string; //AP:10
  shipCompany: string;
  shippedTime: string;
}
// export interface Order {
//   time: string;
//   customerName: string;
//   phone: string;
//   address: string;
//   orderInfo: OrderItem[];
//   total: number;
//   totalProduct: number;
//   totalWeight: number;
//   note: string;
//   status: string;
//   confirmed: boolean;
//   staff: string;
//   buyerIP: string;
//   website: string;
//   deliveryStatus: string;
//   historyChanged?: { event: string; time: string }[];
//   facebookLink?: string;
//   tiktokLink?: string;
// }

interface Promotions {
  shipTags: "none" | "freeship";
  discount: number;
}

export interface OriginalOrder {
  time: string;
  customerName: string;
  phone: string;
  address: string;
  orderInfo: OrderItem[];
  total: number;
  totalProduct: number;
  totalWeight: number;
  note: string;
  staff: string;
  buyerIP: string;
  website: string;
  facebookLink?: string;
  tiktokLink?: string;
}

export interface FinalOrder {
  orderCode: string;
  time: string;
  customerName: string;
  phone: string;
  address: string;
  orderInfo: OrderItem[];
  total: number;
  totalProduct: number;
  totalWeight: number;
  note: string;
  status: string;
  confirmed: boolean;
  staff: string;
  buyerIP: string;
  website: string;
  deliveryStatus: string;
  deliveryCode: string;
  historyChanged?: { event: string; time: string }[];
  facebookLink?: string;
  tiktokLink?: string;
  promotions: Promotions

}

export interface OrderDataFromServerType {
  _id: string;
  productId: string;
  orderCode: string;
  staffID: string;
  original: OriginalOrder;
  final: FinalOrder;
  deliveryDetails: DeliveryDetails;
  stockAdjusted: boolean,
}

type ApiResult = { status: "success" | "failed"; message?: string };

// ---------- Zustand Store ----------
interface ShopOrderState {
  orders: OrderDataFromServerType[];
  fetchOrders: () => Promise<{ status: string; message: string } | undefined>;
  addOrder: (order: Partial<FinalOrder>) => Promise<{ status: string } | undefined>;
  updateOrder: (id: string, updates: OrderDataFromServerType) => Promise<{ status: string } | undefined>;
  deleteOrder: (id: string) => Promise<{ status: string } | undefined>;
  deleteManyOrder: (ids: string[]) => Promise<{ status: string } | undefined>;
  updateMultipleOrders: (ids: string[], updates: Partial<FinalOrder>) => Promise<{ status: string; result: any } | undefined>;
  uploadOrdersExcel: (file: File) => Promise<{ status: string; count: any }>;
  addOrderDataFromServer: (fullOrder: OrderDataFromServerType) => Promise<void>;
  addArrayOrderDataFromServer: (fullOrder: OrderDataFromServerType[]) => Promise<void>;
  uploadDeliveryExcel: (file: File, shipCompany: string) => Promise<{ status: string; count: any }>;
}

export const useShopOrderStore = create<ShopOrderState>((set, get) => ({
  orders: [],

  // Fetch all orders
  fetchOrders: async () => {
    try {
      const { getAuthHeader,} = useAuthStore.getState();
      const res = await axiosApiCall.get(GetShopOrders_API, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      set({ orders: res.data });
      return { status: "success", message: "" };
    } catch (err: any) {
      console.error("Failed to fetch shop orders:", err);
      return { status: "failed", message: err.message };
    }
  },

  // Add new order
  addOrder: async (order: Partial<FinalOrder & { productId: string }>) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.post(AddShopOrders_API, order, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      set({ orders: [...get().orders, res.data] });
      return { status: "success" };
    } catch (err) {
      console.error("Failed to add order:", err);
      return { status: "failed" };
    }
  },

  // Update order (only final will be changed in backend)
  updateOrder: async (id: string, updates: OrderDataFromServerType) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.put(`${GetShopOrders_API}/${id}`, updates, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      set({
        orders: get().orders.map((o) => (o._id === id ? res.data : o)),
      });
      return { status: "success" };
    } catch (err) {
      console.error("Failed to update order:", err);
      return { status: "failed" };
    }
  },

  // Delete order
  deleteOrder: async (id: string) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      await axiosApiCall.delete(`${GetShopOrders_API}/${id}`, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      set({ orders: get().orders.filter((o) => o._id !== id) });
      return { status: "success" };
    } catch (err) {
      console.error("Failed to delete order:", err);
      return { status: "failed" };
    }
  },
  deleteManyOrder: async (ids: string[]) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      await axios.post(
        `${GetShopOrders_API}/bulk-delete`,
        {
          deleteIds: ids,
        },
        {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        }
      );
      set({ orders: get().orders.filter((o) => !ids.includes(o.orderCode)) });
      return { status: "success" };
    } catch (err) {
      console.error("Failed to delete order:", err);
      return { status: "failed" };
    }
  },
  updateMultipleOrders: async (ids: string[], updates: Partial<FinalOrder>) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const localFormatted = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace("T", " ");
      const res = await axios.put(
        `${GetShopOrders_API}/bulk-update`,
        { ids, ...updates, localFormatted },
        {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        }
      );

      // Optimistic update local state
      set({
        orders: get().orders.map((o) => (ids.includes(o._id) ? { ...o, final: { ...o.final, ...updates } } : o)),
      });

      return { status: "success", result: res.data };
    } catch (err) {
      console.error("Failed to bulk update orders:", err);
      return { status: "failed", result: "" };
    }
  },

  uploadOrdersExcel: async (file: File) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${GetShopOrders_API}/upload-orders`, formData, {
        headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
      });

      // merge new orders into store
      set({ orders: [...get().orders, ...res.data.orders] });
      return { status: "success", count: res.data.inserted };
    } catch (err) {
      console.error("Failed to upload orders:", err);
      return { status: "failed", count: 0 };
    }
  },
  addOrderDataFromServer: async (fullOrder) => {
    set((state) => ({
      orders: [...state.orders, fullOrder],
    }));
  },
  addArrayOrderDataFromServer: async (fullOrder) => {
    set((state) => ({
      orders: [...state.orders, ...fullOrder],
    }));
  },
  uploadDeliveryExcel: async (file: File, shipCompany: string) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("shipCompany", shipCompany); // ✅ Add this

      const res = await axios.post(`${GetShopOrders_API}/upload-delivery-details`, formData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      return { status: "success", count: res.data.updatedCount };
    } catch (err) {
      console.error("Failed to upload orders:", err);
      return { status: "failed", count: 0 };
    }
  },
}));
