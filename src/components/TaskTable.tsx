'use client'

import useTaskStore from "../store/useTaskStore";
import { useEffect } from "react";

function TaskTable() {
  const { tasks, loadTasks } = useTaskStore();

  useEffect(() => {
    loadTasks(); // Load tasks when component mounts
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.priority}</td>
            <td>{task.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;
