import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type DefaultUser } from "@prisma/client";

export type GetProjectMembersResponse = {
  members: DefaultUser[];
};

type MembersParams = {
  params: {
    project_id: number;
  };
};

export async function GET(req: NextRequest, { params }: MembersParams) {
  const { project_id } = params;

  // Step 1: Get all members of the project
  const members = await prisma.member.findMany({
    where: {
      projectId: parseInt(project_id),
    },
  });

  // Step 2: Get corresponding user details
  const users = await prisma.defaultUser.findMany({
    where: {
      id: {
        in: members.map((member) => member.id),
      },
    },
  });

  // Step 3: Merge role info from member table
  const membersWithRole = users.map((user) => {
    const member = members.find((m) => m.id === user.id);
    return {
      ...user,
      role: member?.manager ? "manager" : "member", // Inject project-specific role
    };
  });

  return NextResponse.json({ members: membersWithRole });
}

