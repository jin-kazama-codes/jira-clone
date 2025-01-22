import { parseCookies } from "@/utils/cookies";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { id: projectId } = parseCookies(req, "project");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID not found in cookies" },
        { status: 400 }
      );
    }

    const workflow = await prisma.workflow.findUnique({
      where: { projectId: projectId },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found for the given project ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ workflow });
  } catch (error) {
    console.error("Error fetching workflow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id: projectId } = parseCookies(req, "project");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const { nodes, edges } = await req.json();

    if (!nodes || !edges) {
      return NextResponse.json(
        { error: "Invalid workflow data" },
        { status: 400 }
      );
    }

    // Update the workflow in the database
    const updatedWorkflow = await prisma.workflow.update({
      where: { projectId },
      data: {
        workflow: { nodes, edges }, // Update with the provided nodes and edges
      },
    });

    return NextResponse.json({ Workflow: updatedWorkflow }, { status: 200 });
  } catch (error) {
    console.error("Error updating workflow:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
