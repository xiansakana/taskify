import { redirect } from "next/navigation";
import React from "react";

import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdClient } from "./client";

const Workspace = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return <WorkspaceIdClient />;
};

export default Workspace;
