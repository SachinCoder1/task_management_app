"use client";

import React, { useEffect } from "react";
import { Button } from "./ui/button";
import TaskTable from "./TaskTable";
import useDrawerStore from "@/store/useDrawerStore";
import TaskFilters from "./TaskFilters";
import CustomFieldEditor from "./CustomFieldEditor";
import useTaskStore from "@/store/useTaskStore";

type Props = {};

const Main = (props: Props) => {
  const openDrawer = useDrawerStore().openDrawer;
  const loadInitialTaskData = useTaskStore().loadInitialTaskData;
  const loading = useTaskStore().loading;
  useEffect(() => {
    loadInitialTaskData();
  }, []);

  if (loading) {
    return (
      // <div className="flex animate-pulse space-x-4 overflow-hidden">
      //   <div className="flex-1 space-y-6 py-1">
      //     <div className="h-32 rounded bg-gray-200"></div>
      //     <div className="space-y-3">
      //       <div className="grid grid-cols-3 gap-4">
      //         <div className="col-span-3 h-12 rounded bg-gray-200"></div>
      //       </div>
      //       <div ></div>
      //       {Array(9)
      //         .fill(1)
      //         .map((_,index) => (
      //           <div key={index} className="h-8 rounded bg-gray-200"></div>
      //         ))}
      //     </div>
      //   </div>
      // </div>
      <div className="h-[75vh] flex flex-col bg-white">
        <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
          <div className="flex justify-center flex-col items-center gap-4">
            <div
              className="animate-spin inline-block size-20 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p>loading 😊...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-x-4">
        <Button
          className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => openDrawer()}
        >
          + Create Task
        </Button>

        <CustomFieldEditor />
      </div>

      <TaskFilters />

      <TaskTable />
    </div>
  );
};

export default Main;
