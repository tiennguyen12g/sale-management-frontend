import { create } from "zustand";
import { useAuthStore } from "./authStore";
import axiosApiCall from "./axiosApiClient";
import { backendAPI } from "../configs/api";

//============================
// Types
//============================
export interface TagType {
  id: string;
  tagName: string;
  color: string;
  description?: string;
}
export interface MediaLinkedType{
id: string;
url: string, 
type: "image" | "video"
}
export interface FastMessageType {
  id: string;
  keySuggest: string;
  listMediaUrl: MediaLinkedType[];
  messageContent: string;
}

export interface FavoritAlbum {
  id: string;
  nameImage: string;
  url: string;
}

export interface ISettings {
  userId: string;
  shopTagList: TagType[];
  fastMessages: FastMessageType[];
  favoritAlbum: FavoritAlbum[];
}

//============================
// Store
//============================
interface SettingsState {
  settings: ISettings | null;

  // First fetch on login
  initSettings: (settings: ISettings) => void;

  // CRUD Updates
  addTag: (newArrayTag: TagType[]) => Promise<void>;
  updateTag: (tagId: string, updates: Partial<TagType>) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;

  addFastMessage: (fastMsg: FastMessageType) => Promise<void>;
  updateFastMessage: (msgId: string, updates: Partial<FastMessageType>) => Promise<void>;
  deleteFastMessage: (msgId: string) => Promise<void>;

  uploadFavoriteMedia: (file: File) => Promise<void>;
  deleteFavoriteMedia: (id: string) => Promise<void>;

  updateSettingsWhenLogin: (dataSettings: ISettings) => void;
}

export const useSettingStore = create<SettingsState>((set, get) => ({
  settings: null,

  // ✅ On login: set settings returned from backend
  initSettings: (settings) => {
        localStorage.setItem("settings", JSON.stringify(settings));
    set({ settings })
},

  // ======================
  // ✅ TAG CRUD
  // ======================
  // Add Tag
  addTag: async (newArrayTag) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.post(`${backendAPI}/settings/tags`, { newArrayTag }, { headers: getAuthHeader() });
      // server returns updated tag list
      set((state) => ({
        settings: state.settings ? { ...state.settings, shopTagList: res.data } : state.settings,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Update Tag
  updateTag: async (tagId, updates) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.put(`${backendAPI}/settings/tags/${tagId}`, updates, { headers: getAuthHeader() });
      set((state) => ({
        settings: state.settings ? { ...state.settings, shopTagList: res.data } : state.settings,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Delete Tag
  deleteTag: async (tagId) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.delete(`${backendAPI}/settings/tags/${tagId}`, { headers: getAuthHeader() });
      set((state) => ({
        settings: state.settings ? { ...state.settings, shopTagList: res.data } : state.settings,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // ======================
  // ✅ FAST MESSAGE CRUD
  // ======================
  // Add Fast Message
  addFastMessage: async (fastMsg) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.post(`${backendAPI}/settings/fast-messages`, { fastMessage: fastMsg }, { headers: getAuthHeader() });
      set((state) => ({
        settings: state.settings ? { ...state.settings, fastMessages: res.data } : state.settings,
      }));

    } catch (err) {
      console.error(err);
    }
  },

  // Update Fast Message
  updateFastMessage: async (msgId, updates) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.put(`${backendAPI}/settings/fast-messages/${msgId}`, updates, { headers: getAuthHeader() });
      set((state) => ({
        settings: state.settings ? { ...state.settings, fastMessages: res.data } : state.settings,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // Delete Fast Message
  deleteFastMessage: async (msgId) => {
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await axiosApiCall.delete(`${backendAPI}/settings/fast-messages/${msgId}`, { headers: getAuthHeader() });
      set((state) => ({
        settings: state.settings ? { ...state.settings, fastMessages: res.data } : state.settings,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // ======================
  // ✅ FAVORITE MEDIA CRUD
  // ======================
  uploadFavoriteMedia: async (file: File) => {
    const { settings } = get();
    if (!settings) return;

    const formData = new FormData();
    formData.append("file", file);

    const { getAuthHeader } = useAuthStore.getState();
    const res = await axiosApiCall.post(`${backendAPI}/settings/favorite-album`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });

    set({
      settings: {
        ...settings,
        favoritAlbum: res.data.favoritAlbum,
      },
    });
  },

  deleteFavoriteMedia: async (id) => {
    const { getAuthHeader } = useAuthStore.getState();
    const { settings } = get();
    if (!settings) return;

    const res = await axiosApiCall.delete(`${backendAPI}/settings/favorite-album/${id}`, {
      headers: getAuthHeader(),
    });

    set({
      settings: {
        ...settings,
        favoritAlbum: res.data.favoritAlbum,
      },
    });
  },
  updateSettingsWhenLogin: (dataSettings) => {
    set({ settings: dataSettings });
  },
}));

// ✅ Internal function for PUT update to backend
async function updateSettingsRemote(updateData: Partial<ISettings>) {
  const { settings } = useSettingStore.getState();
  if (!settings) return;

  const newSettings = { ...settings, ...updateData };

  const { getAuthHeader } = useAuthStore.getState();
  await axiosApiCall.put(`${backendAPI}/settings`, { settings: newSettings }, { headers: { "Content-Type": "application/json", ...getAuthHeader() } });

  useSettingStore.setState({ settings: newSettings });
}
