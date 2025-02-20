import { prisma } from "@/server/db";
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
  // const { success } = await ratelimit.limit(userId);
  // if (!success) return new Response("Too many requests", { status: 429 });

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
  const page = searchParams.get("page");
  const limit = searchParams.get("limit") ;

  const where = {
    projectId: projectId,
    ...(isClosedOnly
      ? { status: SprintStatus.CLOSED } // Only get closed sprints if closed parameter is true
      : {
          OR: [
            { status: SprintStatus.ACTIVE },
            { status: SprintStatus.PENDING },
          ],
        }),
  };

  // Get the position from the query parameters
  const pos = searchParams.get("position");
  const position = parseInt(pos);
  if (position) {
    where.position = position;
  }

  let sprintsQuery = {
    where,
    orderBy: {
      position: "asc",
    },
  };


  // Apply pagination only if both page and limit are provided
  if (page !== null && limit !== null) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (!isNaN(pageNumber) && !isNaN(limitNumber)) {
      sprintsQuery.skip = pageNumber * limitNumber;
      sprintsQuery.take = limitNumber;
    }
  }

  const [sprints, totalCount] = await Promise.all([
    prisma.sprint.findMany(sprintsQuery),
    prisma.sprint.count({ where }),
  ]);

  const hasNextPage =
    page !== null &&
    limit !== null &&
    (parseInt(page, 10) + 1) * parseInt(limit, 10) < totalCount;

  return NextResponse.json({
    sprints,
    nextPage: hasNextPage ? parseInt(page, 10) + 1 : null,
  });
}


