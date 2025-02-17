// Create this hook to update the url based on whats status the user wants to filter is tasks by.

import {
  parseAsStringEnum,
  useQueryStates,
  parseAsString,
} from "nuqs";

import { TaskStatus } from "../types";

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
