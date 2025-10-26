import { create } from "zustand";
import { type StaffRole } from "./staffStore";

import axiosApiCall from "./axiosApiClient";
import { backendAPI } from "../configs/api";
export interface ShopTagType {
  id: string;
  tagName: string;
  color: string;
}
export interface UserType {
  id: string;
  username: string;
  email: string;
  staffRole: StaffRole;
  isCreateProfile: boolean;
  registeredDate: string;
  administrator: string;
  settings: {
    shopTagList: ShopTagType[];
    [k: string]: any;
  };
}
interface YourStaffInfoType {
  staffID: string;
}
interface AuthState {
  token: string | null;
  user: UserType | null;
  yourStaffId: string | null;
  settings: { [k: string]: any } | null;
  login: (token: string, user: UserType, yourStaffInfo: YourStaffInfoType) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization?: string };
  setYourStaffId: (staffID: string) => void;
  setSettings: (settingData: any) => void;
  updateSettingTag: (settingData: any) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,

  yourStaffId: null,
  settings: null,
  login: (token, user, yourStaffInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("settings", JSON.stringify(user.settings));
    localStorage.setItem("yourStaffInfo", JSON.stringify(yourStaffInfo));

    set({ token, user, yourStaffId: yourStaffInfo.staffID, settings: user.settings });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("settings");
    localStorage.removeItem("yourStaffInfo");
    set({ token: null, user: null });
  },

  getAuthHeader: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  setYourStaffId: (staffID) => {
    set({ yourStaffId: staffID });
  },
  setSettings: (settingData) => {
    set({ settings: settingData });
  },
  updateSettingTag: async (settingData) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.put(
        `${backendAPI}/auth/update-setting/shop-tag`,
        { settings: settingData },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      console.log("res", res);
      set({settings: settingData})
    } catch (err) {
      console.error("❌ Failed to update conversation:", err);
    }
  },
}));
