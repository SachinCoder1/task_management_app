import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Asterisk } from "lucide-react";
import React, { InputHTMLAttributes } from "react";

type InputWithLabelProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  id,
  className,
  required,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
      <Label className="flex items-start" htmlFor={inputId}>{label} {required && <Asterisk className="w-2 h-2 text-destructive" />}</Label>
      <Input id={inputId} {...props} />
    </div>
  );
};
