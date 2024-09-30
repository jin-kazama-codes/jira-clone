import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, ratelimit } from "@/server/db";
import { filterUserForClient } from "@/utils/helpers";
import { parseCookies } from "@/utils/cookies";

const patchCommentBodyValidator = z.object({
  content: z.string(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const userId = parseCookies(req, 'user').id;
  if (!userId) return new Response("Unauthenticated request", { status: 403 });
  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { commentId } = params;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = await req.json();

  const validated = patchCommentBodyValidator.safeParse(body);

  if (!validated.success) {
    const message =
      "Invalid body. " + (validated.error.errors[0]?.message ?? "");
    return new Response(message, { status: 400 });
  }

  const { data: valid } = validated;

  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: valid.content,
      isEdited: true,
    },
  });

  const author = await prisma.defaultUser.findUnique({
    where: {
      id: comment.authorId,
    },
  });
  const authorForClient = filterUserForClient(author);

  return NextResponse.json({
    comment: {
      ...comment,
      author: authorForClient,
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  const userId = parseCookies(req, "user").id;
  if (!userId) return new Response("Unauthenticated request", { status: 403 });

  const { success } = await ratelimit.limit(userId);
  if (!success) return new Response("Too many requests", { status: 429 });

  const { commentId } = params;

  try {
    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new Response("Comment not found", { status: 404 });
    }

    
    if (comment.authorId !== userId) {
      return new Response("You do not have permission to delete this comment", {
        status: 403,
      });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return new Response("Comment deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response("Failed to delete comment", { status: 500 });
  }
}
