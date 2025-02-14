'use client'

export const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("TaskManagerDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("tasks")) {
          const taskStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
          taskStore.createIndex("title", "title", { unique: false });
          taskStore.createIndex("priority", "priority", { unique: false });
          taskStore.createIndex("status", "status", { unique: false });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  // Fetch all tasks
  export const getTasks = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("tasks", "readonly");
      const store = transaction.objectStore("tasks");
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  // Add multiple tasks
  export const addMultipleTasks = async (tasks) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("tasks", "readwrite");
      const store = transaction.objectStore("tasks");
  
      tasks.forEach((task) => store.add(task));
  
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  };
  