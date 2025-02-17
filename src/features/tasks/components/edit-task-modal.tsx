"use client";
import React from "react";

import { ResponsiveModal } from "@/components/responsive-modal";

import { EditTaskFormWrapper } from "./edit-task-form-wrapper";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModal();

  return (
    <ResponsiveModal
      open={!!taskId}
      onOpenChange={close}>
      {taskId && (
        <EditTaskFormWrapper
          onCancel={close}
          id={taskId}
        />
      )}
    </ResponsiveModal>
  );
};
