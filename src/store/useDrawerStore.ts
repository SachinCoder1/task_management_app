import { create } from "zustand";
import { Task } from "@/types";

type DrawerStoreState = {
  isOpen: boolean;
  editingTask: Task | null;
};

type DrawerStoreActions = {
  openDrawer: (task?: Task | null) => void;
  closeDrawer: () => void;
};

const useDrawerStore = create<DrawerStoreState & DrawerStoreActions>((set) => ({
  isOpen: false,
  editingTask: null,

  openDrawer: (task = null) => set({ isOpen: true, editingTask: task }),
  closeDrawer: () => set({ isOpen: false, editingTask: null }),
}));

export default useDrawerStore;
