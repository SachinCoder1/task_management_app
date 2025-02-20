"use client";

import useTaskStore from "@/store/useTaskStore";
import { useState } from "react";
import CustomDrawer from "./ui/CustomDrawer";
import { Button } from "./ui/button";
import { CustomField } from "@/types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function CustomFieldEditor() {
  const { customFields, addCustomField, removeCustomField } = useTaskStore();
  const [isOpen, setIsOpen] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<CustomField["type"]>("text");

  const handleAddField = () => {
    if (!fieldName.trim()) return alert("Field name is required!");
    if (customFields.some((f) => f.name === fieldName))
      return alert("Field name must be unique!");

    addCustomField({ name: fieldName, type: fieldType });
    setFieldName("");
  };

  const handleFieldDelete = async (name: string) => {
    const answer = confirm(`Are you sure? you want to delete "${name}" field`);
    if (answer) {
      console.log("deleting...");
      removeCustomField(name);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Custom fields</Button>
      <CustomDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={"Manage Custom Fields"}
      >
        {/* <div className="p-4 border rounded bg-white shadow-md"> */}
        <h2 className="text-lg mb-2 font-normal">Add Custom field</h2>
        <div className="flex flex-col gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fieldname">Field Name</Label>
            <Input
              type="text"
              id="fieldname"
              placeholder="Field name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="fieldtype">Field type</Label>
            <select
              value={fieldType}
              id="fieldtype"
              onChange={(e) =>
                setFieldType(e.target.value as CustomField["type"])
              }
              className="p-2 border rounded"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          {/* <input
              type="text"
              placeholder="Field name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="p-2 border rounded"
            /> */}
          <Button className="w-full" onClick={handleAddField}>
            Add Field
          </Button>
        </div>

        {/* List of custom fields */}
        <div className="mt-10 mb-4">
          <hr />
        </div>

        <ul>
          <h2 className="text-lg mb-2 font-normal">Manage Custom Fields</h2>
          {customFields.length <= 0 && <div>No fields added yet 😅 Please add 🚀</div>}

          {customFields?.map((field) => (
            <li
              key={field.name}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {field.name} ({field.type})
              </span>
              <Button
                variant={"destructive"}
                onClick={() => {
                  handleFieldDelete(field.name);
                }}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </CustomDrawer>
    </>
  );
}
