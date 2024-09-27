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
  const members = await prisma.member.findMany({
    where: {
      projectId: parseInt(project_id),
    },
  });

  // USE THIS IF RUNNING LOCALLY -----------------------
  const users = await prisma.defaultUser.findMany({
    where: {
      id: {
        in: members.map((member) => member.id),
      },
    },
  });

  // return NextResponse.json<GetProjectMembersResponse>({ members:users });
  return NextResponse.json({ members: users });
}
