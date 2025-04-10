import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type DefaultUser, type Comment } from "@prisma/client";
import { z } from "zod";
import { parseCookies } from "@/utils/cookies";

export type GetIssueCommentsResponse = {
  comments: GetIssueCommentResponse["comment"][];
};

export type GetIssueCommentResponse = {
  comment: Comment & { author: DefaultUser };
};

export async function GET(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  const { issueId } = params;

  const comments = await prisma.comment.findMany({
    where: {
      issueId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const userIds = comments.map((c) => c.authorId);

  // USE THIS IF RUNNING LOCALLY -----------------------
  const users = await prisma.defaultUser.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });

  const commentsForClient = comments.map((comment) => {
    const author = users.find((u) => u.id === comment.authorId) ?? null;
    return { ...comment, author };
  });

  return NextResponse.json({ comments: commentsForClient });
}

const postCommentBodyValidator = z.object({
  content: z.string().optional(),
  authorId: z.number(),
  imageURL: z.string().optional(),
});

export type PostCommentBody = z.infer<typeof postCommentBodyValidator>;

export async function POST(
  req: NextRequest,
  { params }: { params: { issueId: string } }
) {
  const userId = parseCookies(req, 'user').id;
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  // const { success } = await ratelimit.limit(userId);
  // if (!success) return new Response("Too many requests", { status: 429 });

  const { issueId } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = postCommentBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  console.log("data", valid)

  const comment = await prisma.comment.create({
    data: {
      issueId: issueId,
      content: valid.content ?? '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Attachment","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}' ,
      authorId: valid.authorId,
      imageURL: valid.imageURL ?? undefined,
    },
  });

  const authorForClient = await prisma.defaultUser.findUnique({
    where: {
      id: comment.authorId,
    },
  });

  return NextResponse.json({
    comment: {
      ...comment,
      author: authorForClient,
    },
  });
}
