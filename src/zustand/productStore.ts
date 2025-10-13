import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { GetProducts_API, AddProduct_API } from "../configs/api";
export interface ProductDetailsType {
  name: string;
  stock: number;
  color: string;
  size: string;
  price: number;
  weight: number;
  breakEvenPrice: number;
}

export interface ProductType {
  _id: string;
  productId: string;
  name: string;
  typeProduct: string;
  sizeAvailable: string[];
  colorAvailable: string[];
  productDetailed: ProductDetailsType[];
  imageUrl: { name: string; color: string; url: string }[];
  endpointUrl: string;
  material?: string;
  description?: string;
  category?: string;
  stock?: number;
  supplier?: string;
  tags?: string[];
  warranty?: string;
  salesCount?: number;
  notes?: string;
}

interface ProductState {
  products: ProductType[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<{ status: string; message: string } | undefined>;
  addProduct: (p: Omit<ProductType, "_id">) => Promise<{ status: string; message: string } | undefined>;
  updateProduct: (id: string, p: Partial<ProductType>) => Promise<{ status: string; message: string } | undefined>;
  deleteProduct: (id: string) => Promise<{ status: string; message: string } | undefined>;
  startAutoFetch: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { getAuthHeader, logout } = useAuthStore.getState();
      const res = await fetch(GetProducts_API, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });
      const data = await res.json();

      if (res.status === 401) {
        logout();
        window.location.href = "/login";
        return { status: "No valid token", message: data.message };
      }
      set({ products: data, loading: false });
      return { status: "success", message: data.message };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { status: "failed", message: err.message };
    }
  },

  addProduct: async (p) => {
    try {
      const { getAuthHeader, logout } = useAuthStore.getState();
      const res = await fetch(AddProduct_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (res.ok) {
        set((state) => ({ products: [data, ...state.products] }));
        return { status: "success", message: "" };
      }
    } catch (err: any) {
      set({ error: err.message });
      return { status: "failed", message: err.message };
    }
  },

  updateProduct: async (id, p) => {
    try {
      const { getAuthHeader, logout } = useAuthStore.getState();
      const res = await fetch(`${GetProducts_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(p),
      });
       const data = await res.json();
      if (res.ok) {
        set((state) => ({
          products: state.products.map((prod) => (prod._id === id ? { ...prod, ...data } : prod)),
        }));
        return { status: "success", message: "" };
      }
    } catch (err: any) {
      set({ error: err.message });
      return { status: "failed", message: err.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      const { getAuthHeader,} = useAuthStore.getState();
      const res = await fetch(`${GetProducts_API}/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeader() },
      });
      if (res.ok) {
        set((state) => ({
          products: state.products.filter((prod) => prod._id !== id),
        }));
        return { status: "success", message: "" };
      }
    } catch (err: any) {
      set({ error: err.message });
      return { status: "failed", message: err.message };
    }
  },
  startAutoFetch: () => {
    // ✅ Prevent multiple intervals
    if ((get() as any)._intervalStarted) return;
    (get() as any)._intervalStarted = true;

    // ✅ Call once immediately
    get().fetchProducts();

    setInterval(() => {
      get().fetchProducts();
    }, 20 * 1000);
  },
}));
