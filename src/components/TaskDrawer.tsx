"use client";

import { useEffect } from "react";
import useTaskStore from "../store/useTaskStore";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomDrawer from "./ui/CustomDrawer";
import useDrawerStore from "@/store/useDrawerStore";
import { Button } from "./ui/button";
import { ArrowRight, Check, CheckCheck, ChevronRight } from "lucide-react";
import { InputWithLabel } from "./ui/inputwithlabel";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// Validation Schema
const baseTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  priority: z.enum(["none", "low", "medium", "high"]),
  status: z.enum(["not_started", "in_progress", "completed"]),
});

export default function TaskDrawer() {
  const { addNewTask, updateExistingTask, customFields } = useTaskStore();
  const { isOpen, closeDrawer, editingTask } = useDrawerStore();

  // Default values including dynamic fields
  const defaultValues = {
    title: "",
    priority: "none",
    status: "not_started",
    customFields: customFields.map((field) => ({
      name: field.name,
      value: field.type === "checkbox" ? false : "",
      type: field.type,
    })),
  };

  const taskSchema = baseTaskSchema.extend({
    customFields: z.array(
      z.object({
        name: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
        type: z.string(),
      })
    ),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const { fields } = useFieldArray({
    control,
    name: "customFields",
  });

  const resetForm = () => {
    if (editingTask) {
      // reset(editingTask);
      reset({
        ...editingTask,
        customFields: customFields.map((field) => ({
          name: field.name,
          value:
            editingTask[field.name] ?? (field.type === "checkbox" ? false : ""),
          type: field.type,
        })),
      });
    } else {
      reset(defaultValues);
    }
  };

  useEffect(() => {
    resetForm();
  }, [editingTask, reset, customFields, isOpen]);

  const onSubmit = async (data) => {
    const formattedTask = {
      ...data,
      ...data.customFields.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {}),
    };

    if (editingTask) {
      await updateExistingTask({ ...editingTask, ...formattedTask });
    } else {
      await addNewTask({ id: Date.now(), ...formattedTask });
    }
    closeDrawer();
  };

  return (
    <CustomDrawer
      isOpen={isOpen}
      onClose={closeDrawer}
      title={editingTask ? "Edit Task" : "Create Task"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <InputWithLabel
          required
          label="Title"
          placeholder="Title"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        {/* Priority Dropdown */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select
            {...register("priority")}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="status">Status</Label>
          <select
            {...register("status")}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Custom Fields */}
        {fields.map((field, index) =>
          field.type == "checkbox" ? (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`customFields.${index}.value`)}
                className="h-4 w-4"
              />
              <Label htmlFor={field.name}>{field.name}</Label>
            </div>
          ) : (
            <div
              key={field.id}
              className="grid w-full max-w-sm items-center gap-1.5"
            >
              <Label htmlFor={field.name}>{field.name}</Label>
              <Input
                type={field.type}
                {...register(`customFields.${index}.value`)}
                // className="w-full p-2 border rounded mt-1"
                placeholder={field.name}
              />
            </div>
          )
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-x-2">
          <Button
            type="button"
            variant={"outline"}
            // className="px-4 py-2 bg-gray-300 rounded"
            onClick={closeDrawer}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            // className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            className="w-full"
          >
            {editingTask ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </CustomDrawer>
  );
}
