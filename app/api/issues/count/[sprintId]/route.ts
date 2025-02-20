import { prisma } from "@/server/db";
import { parseCookies } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { sprintId: string | null } }
  ) {
    const { id: projectId } = parseCookies(req, "project");
    let { sprintId } = params;

    const isBacklog = sprintId === "backlog";
    sprintId = isBacklog ? null : sprintId;
  
    try {
      // Fetch the main issue
      const allIssues = await prisma.issue.findMany({
        where: {
          projectId: projectId,
          sprintId: sprintId,
          ...(isBacklog && { type: "TASK" }), 
        },
      });
  
      if (!allIssues) {
        return NextResponse.json({ count: 0 }, { status: 404 });
      }

      return NextResponse.json({ count: allIssues.length }, { status: 200 });
    } catch (error) {
      console.error("Error fetching issue:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }