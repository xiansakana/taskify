import { redirect } from "next/navigation";
import React from "react";

import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const TasksPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");
  // TODO: Only Render the tasks of the user.
  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
