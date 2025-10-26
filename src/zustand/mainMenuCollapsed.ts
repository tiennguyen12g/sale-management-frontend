import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MainMenuState {
  openMenu: string;
  activeSubmenu: string;
  menuCollapsed: boolean;
  setOpenMenu: (menu: string) => void;
  setActiveSubmenu: (submenu: string) => void;
  toggleMenuCollapse: () => void;
}

export const useMainMenuStore = create<MainMenuState>()(
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
      name: "main-menu-storage", // key in localStorage
      partialize: (state) => ({ menuCollapsed: state.menuCollapsed }),
    }
  )
);
