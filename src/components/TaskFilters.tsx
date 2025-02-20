"use client";

import useTaskStore from "@/store/useTaskStore";
import { Button } from "./ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { RefreshCcw } from "lucide-react";

export default function TaskFilters() {
  const { filterTasks, resetFilters, customFields, filterValues } =
    useTaskStore();

  return (
    <div className="mb-4 flex gap-4 justify-between">
      <div className="flex gap-4">
        {/* Title Filter */}
        <Input
          type="text"
          placeholder="Search by title..."
          value={(filterValues.title as string) || ""}
          onChange={(e) =>
            filterTasks({ ...filterValues, title: e.target.value })
          }
          className="p-2 border rounded"
        />

        {/* Priority Filter */}
        <select
          value={(filterValues.priority as string) || ""}
          onChange={(e) =>
            filterTasks({ ...filterValues, priority: e.target.value })
          }
          className="p-2 border rounded"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
          <option value="none">None</option>
        </select>

        {/* Status Filter */}
        <select
          value={(filterValues.status as string) || ""}
          onChange={(e) =>
            filterTasks({ ...filterValues, status: e.target.value })
          }
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {customFields.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">More Filters</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Custom Fields</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the filters for the custom fields.
                  </p>
                </div>
                <div className="grid gap-2">
                  {customFields.map((field) => (
                    <div
                      key={field.name}
                      className="grid grid-cols-3 items-center gap-4"
                    >
                      <Label htmlFor={field.name}>{field.name}</Label>

                      {field.type === "checkbox" ? (
                        <Checkbox
                          id={field.name}
                          checked={
                            (filterValues[field.name] as boolean) || false
                          }
                          onCheckedChange={(isChecked) =>
                            filterTasks({
                              ...filterValues,
                              [field.name]: isChecked,
                            })
                          }
                        />
                      ) : null}

                      {field.type === "number" ? (
                        <Input
                          type="number"
                          value={(filterValues[field.name] as number) || ""}
                          onChange={(e) =>
                            filterTasks({
                              ...filterValues,
                              [field.name]: e.target.value,
                            })
                          }
                          placeholder={`Filter ${field.name}`}
                          className="col-span-2 h-8"
                        />
                      ) : null}

                      {field.type === "text" ? (
                        <Input
                          type="text"
                          placeholder={`Filter ${field.name}`}
                          className="col-span-2 h-8"
                          value={(filterValues[field.name] as string) || ""}
                          onChange={(e) =>
                            filterTasks({
                              ...filterValues,
                              [field.name]: e.target.value,
                            })
                          }
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Reset Filters Button */}
      <Button variant={"ghost"} onClick={resetFilters}>
        <RefreshCcw /> Reset Filters
      </Button>
    </div>
  );
}
