import { create } from "zustand";
import { type StaffRole } from "./staffStore";

import axiosApiCall from "./axiosApiClient";
import { backendAPI } from "../configs/api";
import { useSettingStore } from "./settingStore";
import { type ISettings } from "./settingStore";
import { type StaffDataType } from "./staffStore";
export interface TagType {
  id: string;
  tagName: string;
  color: string;
  description?: string;
}
export interface UserType {
  id: string;
  username: string;
  email: string;
  staffRole: StaffRole;
  isCreateProfile: boolean;
  registeredDate: string;
  administrator: string;
}
interface YourStaffInfoType {
  staffID: string;
}
// -- Fast message config.
export interface FastMessageType {
  id: string;
  keySuggest: string;
  listImageUrl: { id: string; url: string }[];
  messageContent: string;
}

// -- Favorit album

export interface FavoritAlbum {
  id: string;
  nameImage: string;
  url: string;
}


interface AuthState {
  token: string | null;
  user: UserType | null;
  yourStaffId: string | null;
  yourStaffInfo: StaffDataType | null;
  login: (token: string, user: UserType, yourStaffInfo: StaffDataType, settings: ISettings) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization?: string };
  setYourStaffId: (staffID: string) => void;
  setYourStaffInfo: (info: StaffDataType) => void;

}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
  yourStaffId: null,
  yourStaffInfo: null,

  login: (token, user, yourStaffInfo, settings) => {
    // const { initSettings} = useSettingStore()
    console.log('yourStaffInfo', settings);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("yourStaffInfo", JSON.stringify(yourStaffInfo));

    useSettingStore.getState().initSettings(settings);
    set({ token, user, yourStaffId: yourStaffInfo.staffID});
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
  setYourStaffInfo: (info) => {
    localStorage.setItem("yourStaffInfo", JSON.stringify(info));
    set({yourStaffInfo: info})
  }
}));
