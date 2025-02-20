"use client";

import useTaskStore from "../store/useTaskStore";
import { Button } from "./ui/button";
import TaskDrawer from "./TaskDrawer";
import useDrawerStore from "@/store/useDrawerStore";
import PaginationControls from "./PaginationControls";
import { Task } from "@/types";
import { PencilIcon, Trash2 } from "lucide-react";
import Table, { TD, TH, TR } from "./ui/table";

function TaskTable() {
  const {
    sortColumn,
    sortDirection,
    filteredTasks,
    customFields,
    removeTask,
    sortTasks,
    getPaginatedTasks,
  } = useTaskStore();
  // const displayedTasks = filteredTasks ?? tasks; // Show full list if no filters

  const { openDrawer } = useDrawerStore();

  const confirmDelete = async (task: Task) => {
    const answer = confirm(
      `Are you sure? you want to delete "${task.title.slice(0, 50)}"`
    );
    if (answer) {
      console.log("deleting...");
      await removeTask(task.id);
    }
  };

  const openDrawerForEdit = (task: Task) => {
    console.log("editing task....", task);
    openDrawer(task);
  };

  const getSortIndicator = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? " 🔼" : " 🔽";
    }
    return "";
  };

  const staticColumns = ["title", "priority", "status"];

  return (
    <div className="">
      <Table>
        <thead>
          <TR>
            {staticColumns?.map((item, index) => (
              <TH key={index} onClick={() => sortTasks(item)}>
                {item} {getSortIndicator(item)}
              </TH>
            ))}
            {customFields.map((field) => (
              <TH
                key={field.name}
                disabled={field.type === "checkbox"}
                onClick={
                  field.type !== "checkbox"
                    ? () => sortTasks(field.name)
                    : undefined
                }
              >
                {field.name}{" "}
                {field.type !== "checkbox" ? getSortIndicator(field.name) : ""}
              </TH>
            ))}
            <TH>Actions</TH>
          </TR>
        </thead>
        <tbody>
          {getPaginatedTasks().map((task) => (
            <tr key={task.id}>
              <TD>{task.title}</TD>
              <TD>{task.priority}</TD>
              <TD>{task.status}</TD>
              {customFields.map((field) => (
                <TD key={field.name}>
                  {field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      disabled
                      checked={(task[field.name] as boolean) || false}
                    />
                  ) : (
                    task[field.name] || "N/A"
                  )}
                </TD>
              ))}
              <TD>
                <div className="flex flex-wrap gap-2 items-center pl-2">
                  <Button size="icon" onClick={() => openDrawerForEdit(task)}>
                    <PencilIcon />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDelete(task)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TD>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Show message if no tasks match filters */}
      {filteredTasks && filteredTasks.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No tasks match the filters.
        </p>
      )}

      <PaginationControls />

      {/* Task Drawer for Create/Edit */}
      <TaskDrawer />
    </div>
  );
}

export default TaskTable;
