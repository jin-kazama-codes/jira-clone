import { type NextRequest, NextResponse } from "next/server";
import { prisma, ratelimit } from "@/server/db";
import {
  IssueStatus,
  type Issue,
  IssueType,
  type DefaultUser,
} from "@prisma/client";
import { z } from "zod";
import { type GetIssuesResponse } from "../route";
import { filterUserForClient } from "@/utils/helpers";
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
  const { issueId } = params;
  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
  });
  if (!issue?.parentId) {
    return NextResponse.json({ issue: { ...issue, parent: null } });
  }
  const parent = await prisma.issue.findUnique({
    where: {
      id: issue.parentId,
    },
  });
  // return NextResponse.json<GetIssueDetailsResponse>({ issue });
  return NextResponse.json({ issue: { ...issue, parent } });
}

const patchIssueBodyValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.nativeEnum(IssueType).optional(),
  status: z.nativeEnum(IssueStatus).optional(),
  sprintPosition: z.number().optional(),
  boardPosition: z.number().optional(),
  assigneeId: z.number().nullable().optional(),
  reporterId: z.number().optional(),
  parentId: z.string().nullable().optional(),
  sprintId: z.string().nullable().optional(),
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
  const { id: projectId } = parseCookies(req, "project");

  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });
  const { issueId } = params;
  console.log("valid issue", issueId);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();
  console.log("valid body", body);
  const validated = patchIssueBodyValidator.safeParse(body);
  console.log("valid validated", validated);

  if (!validated.success) {
    // eslint-disable-next-line
    const message = "Invalid body. " + validated.error.errors[0]?.message ?? "";
    return new Response(message, { status: 400 });
  }
  console.log("valid validated  2", validated);
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
    return NextResponse.json({
      issue: { ...issue, assignee: assigneeForClient },
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
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

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
