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

export async function POST(req: Request) {
  try {
    const { id: projectId } = parseCookies(req, "project");

    const workflowData = {
      nodes: [
        {
          id: "1",
          data: { label: "To Do" },
          position: { x: 50, y: 50 },
          priority: 1,
        },
        {
          id: "2",
          data: { label: "In Progress" },
          position: { x: 250, y: 50 },
          priority: 2,
        },
        {
          id: "3",
          data: { label: "Done" },
          position: { x: 450, y: 50 },
          priority: 3,
        },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
      ],
    };

    const existingWorkflow = await prisma.workflow.findUnique({
      where: {
        projectId,
      }
    })

    if(existingWorkflow){
      return;
    }

    // Create resource in the database
    const workflow = await prisma.workflow.create({
      data: {
        projectId,
        workflow: workflowData,
      },
    });

    return NextResponse.json({ Workflow: workflow }, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
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
