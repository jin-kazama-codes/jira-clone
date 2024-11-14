import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Project } from "@prisma/client";

export type GetProjectResponse = {
  project: Project | null;
};

export async function GET(request: Request, { params }: { params: { projectKey: string } }) {
  try {
    const { projectKey } = params;

    if (!projectKey) {
      return NextResponse.json({ error: 'Project key is required' }, { status: 400 });
    }

    // Fetch project by key
    const project = await prisma.project.findUnique({
      where: { key: projectKey },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json<GetProjectResponse>({ project });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching project' }, { status: 500 });
  }
}
