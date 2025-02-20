"use client";

import useTaskStore from "@/store/useTaskStore";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";


export default function PaginationControls() {
  const { currentPage, pageSize, setPage, setPageSize, getTotalPages } = useTaskStore();
  const totalPages = getTotalPages();

  return (
    <div className="flex items-center justify-between mt-4">
      {/* Page Size Selector */}
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="p-2 border rounded"
      >
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="50">50 per page</option>
      </select>

      {/* Page Navigation */}
      <div className="flex gap-2">
        <Button
          // className="px-4 py-2 bg-gray-300 rounded"
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
         <ArrowLeft /> Previous
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <Button
          size={"icon"}
          variant={currentPage === i + 1 ? "default" : "outline"}
            key={i + 1}
            // className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}

        <Button
          // className="px-4 py-2"
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
