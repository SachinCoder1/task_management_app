"use client";

import { DB_NAME, DB_VERSION, STORE_NAME } from "@/constants";
import { Task } from "@/types";

// Open IndexedDB Connection
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const taskStore = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        taskStore.createIndex("title", "title", { unique: false });
        taskStore.createIndex("priority", "priority", { unique: false });
        taskStore.createIndex("status", "status", { unique: false });
        taskStore.createIndex("order", "order", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as Task[]);
    request.onerror = () => reject(request.error);
  });
};

// Add multiple tasks with initial order values
export const addMultipleTasks = async (tasks: Task[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    tasks.forEach((task, index) => store.add({ ...task, order: index + 1 }));

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

// Add a new task
export const addTask = async (task: Omit<Task, "id" | "order">) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("tasks", "readwrite");
      const store = transaction.objectStore("tasks");

      // Get the highest existing order value
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        const tasks = getAllRequest.result;
        const newOrder =
          tasks.length > 0
            ? Math.max(...tasks.map((t) => t.order || 0)) + 1
            : 1;

        // Insert the new task with the highest order
        const request = store.add({ ...task, order: newOrder });

        request.onsuccess = () => resolve({ ...task, order: newOrder });
        request.onerror = () => reject("Failed to add task");
      };
      getAllRequest.onerror = () => reject("Failed to retrieve tasks");
    });
  } catch (error) {
    console.error(error);
    throw new Error("IndexedDB operation failed");
  }
};

// Update an existing task safely
export const updateTask = async (task: Task): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(task);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Failed to update task");
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
