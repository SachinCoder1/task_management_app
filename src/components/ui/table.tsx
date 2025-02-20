import { cn } from "@/lib/utils";
import React, {
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  HTMLAttributes,
} from "react";

type TableProps = TableHTMLAttributes<HTMLTableElement>;
type THProps = ThHTMLAttributes<HTMLTableCellElement> & {
  disabled?: boolean;
};
type TRProps = HTMLAttributes<HTMLTableRowElement>;
type TDProps = TdHTMLAttributes<HTMLTableCellElement> & {
  children: ReactNode;
};

export const Table: React.FC<TableProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <table
      className={cn(
        "w-full border-collapse border border-gray-200 rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </table>
  );
};

export const TH: React.FC<THProps> = ({
  className,
  onClick,
  children,
  disabled,
  ...props
}) => {
  return (
    <th className={cn("p-3 border border-gray-200", className)} {...props}>
      <p
        onClick={onClick}
        className={cn(
          "w-fit",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {children}
      </p>
    </th>
  );
};

export const TR: React.FC<TRProps> = ({ className, children, ...props }) => {
  return (
    <tr className={cn("bg-gray-100 text-left", className)} {...props}>
      {children}
    </tr>
  );
};

export const TD: React.FC<TDProps> = ({ className, children, ...props }) => {
  return (
    <td className={cn("p-3 border border-gray-200", className)} {...props}>
      {children}
    </td>
  );
};

export default Table;
