import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Issue, IssueType, type DefaultUser } from "@prisma/client";
import { z } from "zod";
import { type GetIssuesResponse } from "../route";
import { filterUserForClient, getBaseUrl } from "@/utils/helpers";
import { parseCookies } from "@/utils/cookies";
import { getQueryClient } from "@/utils/get-query-client";

export type GetIssueDetailsResponse = {
  issue: GetIssuesResponse["issues"][number] | null;
};

export type PostIssueResponse = { issue: Issue };

export async function GET(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  const projectId = parseCookies(req, "project").id
  const { issueId } = params;

  try {
    // Fetch the main issue
    const issue = await prisma.issue.findFirst({
      where: {
        key: issueId,
        projectId
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Fetch child issues
    const childIssues = await prisma.issue.findMany({
      where: {
        parentId: issue.id,
      },
    });

    // Fetch sprint only if sprintId exists
    const sprint = issue.sprintId
      ? await prisma.sprint.findUnique({
          where: { id: issue.sprintId },
        })
      : null;

    const assignee = issue.assigneeId
      ? await prisma.defaultUser.findUnique({
          where: { id: issue.assigneeId },
        })
      : null;

    // Combine data into a single object
    const issueWithChildren = {
      ...issue,
      children: childIssues,
      sprint,
      assignee
    };

    return NextResponse.json({ issue: issueWithChildren }, { status: 200 });
  } catch (error) {
    console.error("Error fetching issue:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const patchIssueBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(IssueType).optional(),
  status: z.string().optional(),
  sprintPosition: z.number().optional(),
  boardPosition: z.number().optional(),
  assigneeId: z.number().nullable().optional(),
  reporterId: z.number().optional(),
  parentId: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
  estimateTime: z.string().nullable().optional(),
  timeSpent: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
  sprintColor: z.string().optional(),
});

export type PatchIssueBody = z.infer<typeof patchIssueBodyValidator>;
export type PatchIssueResponse = {
  issue: Issue & { assignee: DefaultUser | null };
};

type ParamsType = {
  params: {
    issueId: string;
  };
};

export async function PATCH(req: NextRequest, { params }: ParamsType) {
  const userId = parseCookies(req, "user").id;
  const { id: projectId, key: projectKey } = parseCookies(req, "project");
  const baseUrl = getBaseUrl();

  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  // const { success } = await ratelimit.limit(userId);
  // if (!success) return new Response("Too many requests", { status: 429 });
  const { issueId } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  const validated = patchIssueBodyValidator.safeParse(body);

  if (!validated.success) {
    // eslint-disable-next-line
    const message = "Invalid body. " + validated.error.errors[0]?.message ?? "";
    return new Response(message, { status: 400 });
  }
  const { data: valid } = validated;

  const currentIssue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
  });

  if (!currentIssue) {
    return new Response("Issue not found", { status: 404 });
  }

  const issue = await prisma.issue.update({
    where: {
      id: issueId,
    },
    data: {
      name: valid.name ?? undefined,
      description: valid.description ?? undefined,
      status: valid.status ?? undefined,
      type: valid.type ?? undefined,
      sprintPosition: valid.sprintPosition ?? undefined,
      assigneeId: valid.assigneeId === undefined ? undefined : valid.assigneeId,
      reporterId: valid.reporterId ?? undefined,
      isDeleted: valid.isDeleted ?? undefined,
      sprintId: valid.sprintId === undefined ? undefined : valid.sprintId,
      parentId: valid.parentId === undefined ? undefined : valid.parentId,
      projectId: projectId,
      estimateTime:
        valid.estimateTime === undefined ? undefined : valid.estimateTime,
      timeSpent: valid.timeSpent === undefined ? undefined : valid.timeSpent,
      sprintColor: valid.sprintColor ?? undefined,
      boardPosition: valid.boardPosition ?? undefined,
    },
  });

  if (issue.assigneeId) {
    const assignee = await prisma.defaultUser.findUnique({
      where: {
        id: issue.assigneeId,
      },
    });
    const assigneeForClient = filterUserForClient(assignee);
    const issueUrl = `${baseUrl}/${projectKey}/issue/${issue.key}`;
    return NextResponse.json({
      issue: { ...issue, assignee: assigneeForClient, issueUrl: issueUrl },
    });
  }

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({
    issue: { ...issue, assignee: null },
  });
}

export async function DELETE(req: NextRequest, { params }: ParamsType) {
  const userId = parseCookies(req, "user").id;
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  // const { success } = await ratelimit.limit(userId);
  // if (!success) return new Response("Too many requests", { status: 429 });

  const { issueId } = params;

  const issue = await prisma.issue.update({
    where: {
      id: issueId,
    },
    data: {
      isDeleted: true,
      boardPosition: -1,
      sprintPosition: -1,
      sprintId: "DELETED-SPRINT-ID",
    },
  });

  // return NextResponse.json<PostIssueResponse>({ issue });
  return NextResponse.json({ issue });
}
