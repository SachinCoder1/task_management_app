import { PRIORITY_ORDER, STATUS_ORDER } from "@/constants";
import { addTask, deleteTask, getTasks, updateTask } from "@/lib/db";
import { loadInitialData } from "@/lib/loadInitialData";
import { create } from "zustand";
import orderBy from "lodash/orderBy";
import { CustomField, Task } from "@/types";

type TaskStoreState = {
  loading: boolean;
  tasks: Task[];
  customFields: CustomField[];
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  filteredTasks: Task[] | null;
  filterValues: Record<string, unknown>;
  currentPage: number;
  pageSize: number;
};

type TaskStoreActions = {
  loadInitialTaskData: () => Promise<void>;
  addNewTask: (task: Omit<Task, "id" | "order">) => Promise<void>;
  updateExistingTask: (task: Task) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  resetFilters: () => void;
  sortTasks: (column: string) => void;
  filterTasks: (filters: Record<string, unknown>) => void;
  addCustomField: (field: CustomField) => void;
  removeCustomField: (fieldName: string) => void;
  updateTaskField: (taskId: number, fieldName: string, value: unknown) => void;
  setPage: (pageNumber: number) => void;
  setPageSize: (size: number) => void;
  getPaginatedTasks: () => Task[];
  getTotalPages: () => number;
};

const useTaskStore = create<TaskStoreState & TaskStoreActions>((set, get) => ({
  loading: true,
  tasks: [],
  customFields: [], // Store dynamic fields
  sortColumn: null, // Column currently sorted
  sortDirection: "asc", // asc or desc
  filteredTasks: null, // This will be null if no filters are applied
  filterValues: {},

  // Pagination
  currentPage: 1,
  pageSize: 10, // Default page size

  loadInitialTaskData: async () => {
    const tasks = await getTasks(); // Fetch from IndexedDB
    const fields = JSON.parse(localStorage.getItem("customFields") || "[]");

    if (tasks.length === 0) {
      console.log("No tasks in DB. Loading from JSON...");
      await loadInitialData(); // Load JSON only if DB is empty
      const newTasks = await getTasks(); // Fetch again after insertion
      set({ loading: false, customFields: fields, tasks: orderBy(newTasks, "order", "desc") }); // Use Lodash sort
    } else {
      set({ loading: false, customFields: fields, tasks: orderBy(tasks, "order", "desc") });
    }
  },

  addNewTask: async (task) => {
    const newTask = (await addTask(task)) as Task;
    set((state) => ({
      tasks: orderBy([...state.tasks, newTask], "order", "desc"),
    }));
  },

  updateExistingTask: async (updatedTask) => {
    await updateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  },

  removeTask: async (id: number) => {
    await deleteTask(id); // Delete from IndexedDB
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id), // Remove from Zustand state
    }));
  },

  // Reset filters for both default and custom fields
  resetFilters: () => {
    set({ filteredTasks: null, filterValues: {}, sortColumn: null });
  },

  // sortTasks: (column) => {
  //   set((state) => {
  //     let newDirection = "asc";
  //     if (state.sortColumn === column && state.sortDirection === "asc") {
  //       newDirection = "desc";
  //     }

  //     const sortedTasks = [...(state.filteredTasks || state.tasks)].sort(
  //       (a, b) => {
  //         let valA = a[column];
  //         let valB = b[column];

  //         // Handle priority sorting
  //         if (column === "priority") {
  //           valA = PRIORITY_ORDER[a.priority] || 99;
  //           valB = PRIORITY_ORDER[b.priority] || 99;
  //         } else if (column === "status") {
  //           valA = STATUS_ORDER[a.status] || 99;
  //           valB = STATUS_ORDER[b.status] || 99;
  //         } else if (typeof valA === "boolean") {
  //           valA = valA ? 1 : 0;
  //           valB = valB ? 1 : 0;
  //         } else if (typeof valA === "string") {
  //           valA = valA.toLowerCase();
  //           valB = valB.toLowerCase();
  //         }

  //         return newDirection === "asc"
  //           ? valA > valB
  //             ? 1
  //             : -1
  //           : valA < valB
  //           ? 1
  //           : -1;
  //       }
  //     );

  //     return {
  //       filteredTasks: sortedTasks,
  //       sortColumn: column,
  //       sortDirection: newDirection,
  //     };
  //   });
  // },

  // Filter custom fields along with default filters

  sortTasks: (column) => {
    set((state) => {
      // Determine sort direction:
      const isSameColumn = state.sortColumn === column;
      const isAscending = isSameColumn ? state.sortDirection !== "asc" : true;
      const direction = isAscending ? "asc" : "desc";
      const tasks = state.filteredTasks || state.tasks;

      // Iteratee to extract a comparable value.
      const iteratee = (task: Task) => {
        const value = task[column];
        const customField = state.customFields.find(
          (field) => field.name === column
        );

        if (customField) {
          // For checkboxes, we don't sort.
          if (customField.type === "checkbox") return 0;

          if (customField.type === "number") {
            const num = parseFloat(value as string);
            return isNaN(num) ? (isAscending ? Infinity : -Infinity) : num;
          }

          if (customField.type === "text") {
            const text = ((value as string) || "").trim();
            // For ascending order, push empty strings to the end by using a high Unicode value.
            return text ? text.toLowerCase() : isAscending ? "\uffff" : "";
          }
        }

        // For predefined fields.
        if (column === "priority") {
          return PRIORITY_ORDER[task.priority] || 99;
        }

        if (column === "status") {
          return STATUS_ORDER[task.status] || 99;
        }

        if (typeof value === "boolean") {
          return value ? 1 : 0;
        }

        if (typeof value === "string") {
          // For generic strings, you could also add fallback logic if needed.
          return value.toLowerCase();
        }

        return value;
      };

      const sortedTasks = orderBy(tasks, [iteratee], [direction]);

      return {
        filteredTasks: sortedTasks,
        sortColumn: column,
        sortDirection: direction,
      };
    });
  },

  // filterTasks: (filters) => {
  //   set((state) => {
  //     let filtered = state.tasks.filter((task) =>
  //       Object.entries(filters).every(([key, value]) => {
  //         if (!value) return true;
  //         if (typeof task[key] === "string")
  //           return task[key].toLowerCase().includes(value.toLowerCase());
  //         if (typeof task[key] === "boolean")
  //           return task[key] === (value === "true");
  //         return task[key] == value;
  //       })
  //     );

  //     // Apply existing sorting to filtered tasks
  //     if (state.sortColumn) {
  //       let column = state.sortColumn;
  //       let newDirection = state.sortDirection;

  //       filtered = [...filtered].sort((a, b) => {
  //         let valA = a[column];
  //         let valB = b[column];

  //         if (typeof valA === "string") {
  //           valA = valA.toLowerCase();
  //           valB = valB.toLowerCase();
  //         } else if (typeof valA === "boolean") {
  //           valA = valA ? 1 : 0;
  //           valB = valB ? 1 : 0;
  //         }

  //         return newDirection === "asc"
  //           ? valA > valB
  //             ? 1
  //             : -1
  //           : valA < valB
  //           ? 1
  //           : -1;
  //       });
  //     }

  //     return { filteredTasks: filtered, filterValues: filters };
  //   });
  // },

  filterTasks: (filters) => {
    set((state) => {
      const filtered = state.tasks.filter((task) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true; // If no filter value, include task

          const customField = state.customFields.find(
            (field) => field.name === key
          );

          if (customField) {
            if (customField.type === "checkbox") {
              return task[key] === Boolean(value);
            }

            if (customField.type === "number") {
              return Number(task[key]) === Number(value);
            }

            if (customField.type === "text") {
              return (task[key] as string)
                ?.toLowerCase()
                .includes((value as string).toLowerCase());
            }
          }

          // Default behavior for predefined fields
          if (typeof task[key] === "string") {
            return task[key]
              .toLowerCase()
              .includes((value as string).toLowerCase());
          }
          if (typeof task[key] === "boolean") {
            return task[key] === (value === "true");
          }
          return task[key] == value; // Default comparison for numbers
        })
      );

      return { filteredTasks: filtered, filterValues: filters };
    });
  },

  addCustomField: (field) => {
    set((state) => {
      const updatedFields = [...state.customFields, field];
      localStorage.setItem("customFields", JSON.stringify(updatedFields));
      return { customFields: updatedFields };
    });
  },

  // Remove a custom field
  removeCustomField: (fieldName) => {
    set((state) => {
      const updatedFields = state.customFields.filter(
        (f) => f.name !== fieldName
      );
      localStorage.setItem("customFields", JSON.stringify(updatedFields));

      // Remove field from all tasks
      const updatedTasks: Task[] = state.tasks.map((task) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [fieldName]: _, ...rest } = task;
        return { ...rest } as Task;
      });

      return { customFields: updatedFields, tasks: updatedTasks };
    });
  },

  // Update a task with custom field values
  updateTaskField: (taskId, fieldName, value) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? ({ ...task, [fieldName]: value } as Task) : task
      ),
    }));
  },

  // Change page
  // Change page
  setPage: (pageNumber) => set({ currentPage: pageNumber }),

  // Change page size
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),

  // Computed state: Get paginated tasks
  getPaginatedTasks: () => {
    const state = get();
    const allTasks = state.filteredTasks ?? state.tasks;
    const start = (state.currentPage - 1) * state.pageSize;
    return allTasks.slice(start, start + state.pageSize);
  },

  getTotalPages: () => {
    const state = get();
    const totalTasks = state.filteredTasks?.length ?? state.tasks.length;
    return Math.ceil(totalTasks / state.pageSize);
  },
}));

export default useTaskStore;
