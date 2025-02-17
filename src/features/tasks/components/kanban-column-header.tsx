import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { snakeCaseToLowerCase } from "@/lib/utils";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { TaskStatus } from "../types";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

// Define which status gets which icon
const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon
      strokeWidth={3}
      className="size-[16px] text-pink-400"
    />
  ),
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon
      strokeWidth={3}
      className="size-[16px] text-yellow-400"
    />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon
      strokeWidth={3}
      className="size-[16px] text-blue-400"
    />
  ),
  [TaskStatus.TODO]: (
    <CircleIcon
      strokeWidth={3}
      className="size-[16px] text-red-400"
    />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon
      strokeWidth={3}
      className="size-[16px] text-emerald-400"
    />
  ),
};
export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  // Gwt the icon depending on the status
  const icon = statusIconMap[board];
  const { open } = useCreateTaskModal();
  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">
          {snakeCaseToLowerCase(board)}
        </h2>
        <div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button
        // TODO: Populate the status by modifying the Url that when a user click on the button the status is already shown on each category
        onClick={open}
        variant="ghost"
        size="icon"
        className="size-5">
        <PlusIcon className="size-4 text-neutral-400" />
      </Button>
    </div>
  );
};
