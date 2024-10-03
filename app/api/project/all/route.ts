import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Project } from "@prisma/client";

export type GetProjectsResponse = {
  projects: Project[];
};

export async function GET() {
  try {
    const projects = await prisma.project.findMany(); // Fetch all projects from the DB
    return NextResponse.json<GetProjectsResponse>({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}
