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
      position: k,
    },
  });
  // return NextResponse.json<PostSprintResponse>({ sprint });
  return NextResponse.json({ sprint });
}

export async function GET(req: NextRequest) {
  const { id: projectId } = parseCookies(req, "project");

  const { searchParams } = new URL(req.url);

  const isClosedOnly = searchParams.get("closed") === "true";

  const where = {
    projectId: projectId,
    ...(isClosedOnly
      ? { status: SprintStatus.CLOSED } // Only get closed sprints if closed parameter is true
      : { OR: [{ status: SprintStatus.ACTIVE }, { status: SprintStatus.PENDING }] }
    ),
  };

  // Get the position from the query parameters
  const pos = searchParams.get("position");
  const position = parseInt(pos);
  if (position) {
    where.position = position;
  }

  const sprints = await prisma.sprint.findMany({
    where,
    orderBy: {
      position: "asc",
    },
  });

  return NextResponse.json({ sprints });
}


