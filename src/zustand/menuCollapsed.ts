import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StaffMenuState {
  openMenu: string;
  activeSubmenu: string;
  menuCollapsed: boolean;
  setOpenMenu: (menu: string) => void;
  setActiveSubmenu: (submenu: string) => void;
  toggleMenuCollapse: () => void;
}

export const useStaffMenuStore = create<StaffMenuState>()(
  persist(
    (set) => ({
      openMenu: "",
      activeSubmenu: "",
      menuCollapsed: false,
      setOpenMenu: (menu) => set({ openMenu: menu }),
      setActiveSubmenu: (submenu) => set({ activeSubmenu: submenu }),
      toggleMenuCollapse: () =>
        set((state) => ({ menuCollapsed: !state.menuCollapsed })),
    }),
    {
      name: "staff-menu-storage", // key in localStorage
      partialize: (state) => ({ menuCollapsed: state.menuCollapsed }),
    }
  )
);
