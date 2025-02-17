import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";

import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

import { Member, memberRole } from "../types";
import { getMember } from "../utils";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();

      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );

      return c.json({
        data: { ...members, documents: populatedMembers },
      });
    }
  )
  // This will mostly be used to delete members from the workspace

  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    // If we are not a member of the workspace we are unauthorized to perform the delete operation
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // If we are not an ADMIN of the workspace we are unauthorized to delete a member

    if (
      member.$id !== memberToDelete.$id &&
      member.role !== memberRole.ADMIN
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Meaning we cannot delete the last member in the worskspace.
    // For that, we will need to delete the workspace itself.
    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot delete last member" }, 400);
    }

    await databases.deleteDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  // This will mostly be used to upgrade Member Role
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({ role: z.nativeEnum(memberRole) })
    ),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace =
        await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
          Query.equal("workspaceId", memberToUpdate.workspaceId),
        ]);

      // If we are not a member of the workspace we are unauthorized to perform the update
      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // You cannot update unless you are an Administrator
      if (member.role !== memberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Meaning we downgrade the last member in the worskspace.

      if (allMembersInWorkspace.total === 1) {
        return c.json(
          { error: "Cannot downgrade the only member" },
          400
        );
      }

      await databases.updateDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId,
        { role }
      );

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );
export default app;
