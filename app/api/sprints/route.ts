import { prisma, ratelimit } from "@/server/db";
import { parseCookies } from "@/utils/cookies";
import { SprintStatus, type Sprint } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

export type PostSprintResponse = {
  sprint: Sprint;
};

export type GetSprintsResponse = {
  sprints: Sprint[];
};

export async function POST(req: NextRequest) {
  const userId = parseCookies(req, "user").id;
  const { id: projectId } = parseCookies(req, "project");

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
      sprintPosition: k,
    },
  });
  // return NextResponse.json<PostSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}

export async function GET(req: NextRequest) {
  const { id: projectId } = parseCookies(req, "project");
  console.log("reqqqqq", req);
  const where = {
    OR: [{ status: SprintStatus.ACTIVE }, { status: SprintStatus.PENDING }],
    projectId: projectId,
  };
  // Get the query parameters
  const { searchParams } = new URL(req.url);

  // Get the position from the query parameters
  const pos = searchParams.get("position");
  const position = parseInt(pos)
  if (position) {
    where.sprintPosition = position;
    console.log('reqqqqq WHERE', where);
  }

  const sprints = await prisma.sprint.findMany({
    where,
    orderBy: {
      sprintPosition: "asc",
    },
  });

  // return NextResponse.json<GetSprintsResponse>({ sprints });
  return NextResponse.json({ sprints });
}
