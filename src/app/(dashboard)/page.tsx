import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrent();
  const workspaces = await getWorkspaces();

  if (!user) {
    redirect("/sign-in");
  }

  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`workspaces/${workspaces.documents[0].$id}`);
  }
}
