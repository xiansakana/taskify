"use client";
import { formatDistanceToNow } from "date-fns";
import {
  PlusIcon,
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { Analytics } from "@/components/analytics";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks(
    { workspaceId }
  );

  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjects({ workspaceId });

  const { data: members, isLoading: isLoadingMembers } =
    useGetMembers({ workspaceId });

  const isLoading =
    isLoadingProjects ||
    isLoadingMembers ||
    isLoadingTasks ||
    isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return (
      <PageError message="Failed to load workspace data." />
    );
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskList
          data={tasks.documents}
          total={tasks.total}
        />
        <div className="flex flex-col gap-y-4">
          <ProjectList
            data={projects.documents}
            total={projects.total}
          />
          <MembersList
            data={members.documents}
            total={members.total}
          />
        </div>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList = ({
  data,
  total,
}: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Projects ({total})
          </p>
          <Button
            variant="secondary"
            size="icon"
            onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link
                href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="flex items-center gap-x-2.5 p-4">
                    <ProjectAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      image={project.imageUrl}
                      name={project.name}
                    />
                    <p className="truncate text-lg font-medium">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No projects found
          </li>
        </ul>
        {/* TODO: Implement a Projects page to Show all projects. */}
        {/* <Button
          variant="muted"
          className="mt-4 w-full"
          asChild>
          <Link href={`/workspaces/${workspaceId}/projects`}>
            Show All
          </Link>
        </Button> */}
      </div>
    </div>
  );
};

interface TasksListProps {
  data: Task[];
  total: number;
}

export const TaskList = ({ data, total }: TasksListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Tasks ({total})
          </p>
          <Button
            variant="muted"
            size="icon"
            onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link
                href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="rounded-lg shadow-none transition hover:opacity-75">
                  <CardContent className="p-4">
                    <p className="truncate text-lg font-medium">
                      {task.name}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project?.name}</p>
                      <div className="size-2 rounded-full bg-neutral-300" />
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 size-3" />
                        <span className="truncate">
                          {formatDistanceToNow(
                            new Date(task.dueDate)
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button
          variant="muted"
          className="mt-4 w-full"
          asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>
            Show All
          </Link>
        </Button>
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
}

export const MembersList = ({
  data,
  total,
}: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            Members ({total})
          </p>
          <Button
            variant="secondary"
            size="icon"
            asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4  ">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col  items-center gap-x-2 p-3">
                  <MemberAvatar
                    className="size-12"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className=" flex flex-col items-center overflow-hidden">
                    <p className="  line-clamp-1 text-lg font-medium">
                      {member.name}
                    </p>

                    <p className="  text-sm font-medium text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="hidden text-center text-sm text-muted-foreground first-of-type:block">
            No members found
          </li>
        </ul>
        {/* TODO: Implement a Projects page to Show all projects. */}
        {/* <Button
            variant="muted"
            className="mt-4 w-full"
            asChild>
            <Link href={`/workspaces/${workspaceId}/projects`}>
              Show All
            </Link>
          </Button> */}
      </div>
    </div>
  );
};
