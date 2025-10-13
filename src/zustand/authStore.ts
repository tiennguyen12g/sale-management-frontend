import { create } from "zustand";
import { type StaffRole } from "./staffStore";

export interface UserType{
   id: string; 
   username: string; 
   email: string; 
   staffRole: StaffRole; 
   isCreateProfile: boolean; 
   registeredDate: string;
}
interface AuthState {
  token: string | null;
  user: UserType | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  getAuthHeader: () => { Authorization?: string };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  getAuthHeader: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
}));
