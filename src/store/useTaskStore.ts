import { getTasks } from "@/lib/db";
import { loadInitialData } from "@/lib/loadInitialData";
import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],

  loadTasks: async () => {
    await loadInitialData(); // Ensure JSON loads if needed
    const tasks = await getTasks();
    set({ tasks });
  },
}));

export default useTaskStore;
