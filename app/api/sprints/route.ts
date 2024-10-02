import { prisma, ratelimit } from "@/server/db";
import { parseCookies } from "@/utils/cookies";
import { getQueryClient } from "@/utils/get-query-client";
import { SprintStatus, type Sprint } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export type PostSprintResponse = {
  sprint: Sprint;
};

export type GetSprintsResponse = {
  sprints: Sprint[];
};

const queryClient = getQueryClient();

export async function POST(req: NextRequest) {
  const userId = parseCookies(req, "user").id;
  const { id: projectId } = await queryClient.getQueryData(["project"]);

  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const sprints = await prisma.sprint.findMany({
    where: {
      projectId: projectId,
      creatorId: userId,
    },
  });
  const k = sprints.length + 1;

  const sprint = await prisma.sprint.create({
    data: {
      name: `SPRINT-${k}`,
      description: "",
      creatorId: userId,
      projectId: projectId,
    },
  });
  // return NextResponse.json<PostSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}

export async function GET(req: NextRequest) {
  const { id: projectId } = await queryClient.getQueryData(["project"]);
  const sprints = await prisma.sprint.findMany({
    where: {
      OR: [{ status: SprintStatus.ACTIVE }, { status: SprintStatus.PENDING }],
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // return NextResponse.json<GetSprintsResponse>({ sprints });
  return NextResponse.json({ sprints });
}
