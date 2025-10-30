// shopMediaStore.ts
import { create } from "zustand";
import axiosApiCall from "./axiosApiClient";
import { useAuthStore } from "./authStore";
import { backendAPI } from "../configs/api";

export interface MediaItem {
    id: string;
  name: string;
  url: string;
}

interface ShopMediaState {
  images: MediaItem[];
  videos: MediaItem[];
  loading: boolean;

  fetchMedia: (shopId: string) => Promise<void>;
  addMedia: (shopId: string, file: File, type: "image" | "video") => Promise<void>;
  deleteMedia: (shopId: string, type: "image" | "video", fileUrl: string) => Promise<void>;
}

export const useShopMediaStore = create<ShopMediaState>((set, get) => ({
  images: [],
  videos: [],
  loading: false,

  fetchMedia: async (shopId) => {
    if (!shopId) return;
    if (get().images.length || get().videos.length) return; // ✅ cache

    try {
      set({ loading: true });
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.get(`${backendAPI}/shop-media`, {
        headers: getAuthHeader(),
        params: { shopId },
      });
      const data = res.data?.data || { images: [], videos: [] };
      set({ images: data.images, videos: data.videos, loading: false });
    } catch (err) {
      console.error("❌ fetchMedia error:", err);
      set({ loading: false });
    }
  },

  addMedia: async (shopId, file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("shopId", shopId);
    formData.append("type", type);

    const { getAuthHeader } = useAuthStore.getState();
    const res = await axiosApiCall.post(`${backendAPI}/shop-media/add`, formData, {
      headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" },
    });

    const updated = res.data?.data;
    if (updated) set({ images: updated.images, videos: updated.videos });
  },

  deleteMedia: async (shopId, type, fileUrl) => {
    const fileName = fileUrl.split("/").pop();
    const { getAuthHeader } = useAuthStore.getState();
    const res = await axiosApiCall.delete(`${backendAPI}/shop-media/${type}/${fileName}`, {
      headers: getAuthHeader(),
      params: { shopId },
    });
    const updated = res.data?.data;
    if (updated) set({ images: updated.images, videos: updated.videos });
  },
}));
