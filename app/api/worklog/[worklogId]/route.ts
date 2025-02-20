import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { parseCookies } from "@/utils/cookies";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { worklogId: string } }
) {
  const userName = parseCookies(req, "user").name;
  if (!userName)
    return new Response("Unauthenticated request", { status: 403 });

  const { worklogId } = params;
  const { timeLogged, workDescription } = await req.json(); // Get the JSON body

  try {
    // Find the worklog
    const worklog = await prisma.worklog.findUnique({
      where: { id: worklogId },
    });

    if (!worklog) {
      return new Response("Worklog not found", { status: 404 });
    }

    // Uncomment if you want to restrict updates to the author only
    if (worklog.userName !== userName) {
      return new Response("You do not have permission to update this worklog", {
        status: 403,
      });
    }

    // Update the worklog with provided data
    const updatedWorklog = await prisma.worklog.update({
      where: { id: worklogId },
      data: {
        timeLogged: timeLogged,
        workDescription: workDescription,
      },
    });

    const parsedWorklog = JSON.stringify(updatedWorklog);

    return NextResponse.json({ worklog: parsedWorklog }, { status: 200 });
  } catch (error) {
    console.error("Error updating worklog:", error);
    return new Response("Failed to update worklog", { status: 500 });
  }
}

// Delete Worklog

export async function DELETE(
  req: NextRequest,
  { params }: { params: { worklogId: string } }
) {
  const userId = parseCookies(req, "user").id;
  if (!userId) return new Response("Unauthenticated request", { status: 403 });

  const { worklogId } = params;

  try {
    // Find the worklog
    const worklog = await prisma.worklog.findUnique({
      where: { id: worklogId },
    });

    if (!worklog) {
      return new Response("Worklog not found", { status: 404 });
    }

    // Delete the comment

    const deletedWorklog = await prisma.worklog.delete({
      where: { id: worklogId },
    });

    return NextResponse.json(
      { worklog: deletedWorklog, message: "Worklog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting worklog:", error);
    return new Response("Failed to delete worklog", { status: 500 });
  }
}
