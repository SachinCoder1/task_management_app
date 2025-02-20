export interface Task {
  id: number;
  title: string;
  priority: "none" | "low" | "medium" | "high" | "urgent";
  status: "not_started" | "in_progress" | "completed";
  order: number;
  [key: string]: string | number | boolean | null | undefined;
}

export type CustomField = {
  name: string;
  type: "text" | "number" | "checkbox";
};
