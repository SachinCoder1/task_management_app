import { addMultipleTasks, openDB } from "./db";

export const loadInitialData = async () => {
    const db = await openDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("tasks", "readonly");
      const store = transaction.objectStore("tasks");
      const request = store.count();
  
      request.onsuccess = async () => {
        if (request.result === 0) {
          const response = await fetch("/tasks.json");
          const tasks = await response.json();
          await addMultipleTasks(tasks);
        }
        resolve();
      };
  
      request.onerror = () => reject(request.error);
    });
  };
  