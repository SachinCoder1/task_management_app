"use client";

import React from "react";
import { Button } from "./ui/button";
import TaskTable from "./TaskTable";

type Props = {};

const Main = (props: Props) => {
  return (
    <div>
      <Button>hello</Button>
     <TaskTable /> 
    </div>
  );
};

export default Main;
