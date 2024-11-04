import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db"; // adjust this import according to your project structure

export async function GET(req: NextRequest) {
  // Parse the URL to get the query parameters
  const { searchParams } = new URL(req.url);
  
  const issueId = searchParams.get("issueId");

  if (!issueId) {
    return NextResponse.json(
      { error: "Issue ID is required" },
      { status: 400 }
    );
  }

  const worklogs = await prisma.worklog.findMany({
    where: { issueId: issueId }, // Assuming issueId is a number
  });

  // Return the fetched worklogs
  return NextResponse.json({ worklogs });
}


export async function POST(req: NextRequest) {
  try {
    const { timeLogged, workDescription, issueId } = await req.json();

    if (!timeLogged || !workDescription || !issueId) {
      return NextResponse.json(
        { error: "Missing required fields: timeLogged, workDescription, or issueId" },
        { status: 400 }
      );
    }

    // Create a new worklog entry in the database
    const newWorklog = await prisma.worklog.create({
      data: {
        timeLogged,
        workDescription,
        issueId: issueId, // Assuming issueId is a number
      },
    });

    // Return the newly created worklog in the response
    return NextResponse.json({ worklog: newWorklog });
  } catch (error) {
    console.error("Error creating worklog:", error);
    return NextResponse.json(
      { error: "Failed to create worklog" },
      { status: 500 }
    );
  }
}
