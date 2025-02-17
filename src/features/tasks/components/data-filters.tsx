import {
  FolderIcon,
  ListCheckIcon,
  UserIcon,
} from "lucide-react";

import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}
export const DataFilters = ({
  hideProjectFilter,
}: DataFiltersProps) => {
  // Fetches workspaceId
  const workspaceId = useWorkspaceId();

  // Fetches projects for the current workspaceId, using the useGetProjects hook from the projects API module.
  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } =
    useGetMembers({ workspaceId });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
    image: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [
    { status, assigneeId, projectId, dueDate },
    setFilters,
  ] = useTaskFilters();

  const onStatusChange = (value: string) => {
    setFilters({
      status: value === "all" ? null : (value as TaskStatus),
    });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({
      assigneeId: value === "all" ? null : (value as string),
    });
  };

  const onProjectChange = (value: string) => {
    setFilters({
      projectId: value === "all" ? null : (value as string),
    });
  };

  if (isLoading) return null;
  // TODO: Implement a reset button for the filters.
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="mr-2 size-4" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>
            Backlog
          </SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>
            In progress
          </SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>
            In review
          </SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}>
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="mr-2 size-4" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem
              key={member.value}
              value={member.value}>
              <div className="flex gap-x-3">
                <MemberAvatar name={member.label} />
                {member.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}>
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <FolderIcon className="mr-2 size-4" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem
                key={project.value}
                value={project.value}>
                <div className="flex gap-x-3">
                  <ProjectAvatar
                    image={project.image}
                    name={project.label}
                  />
                  {project.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) =>
          setFilters({
            dueDate: date ? date.toISOString() : null,
          })
        }
      />
    </div>
  );
};
