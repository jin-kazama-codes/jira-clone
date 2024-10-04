import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { type Project } from "@prisma/client";
import { parsePageCookies } from "@/utils/cookies";

export type GetProjectResponse = {
  project: Project | null;
};

export async function GET() {
  const projectData = parsePageCookies('project')
  const project = await prisma.project.findUnique({
    where: {
      key: projectData.key,
    },
  });
  // return NextResponse.json<GetProjectResponse>({ project });
  return NextResponse.json({ project });
}

export async function POST(request: Request) {
  const { name, key, userId } = await request.json();

  if (!name || !key || !userId) {
    return NextResponse.json({ error: 'Name, key, and userId are required' }, { status: 400 });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        key,
        defaultAssignee: String(userId),
      },
    });
    return NextResponse.json({ project: newProject });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating project' }, { status: 500 });
  }
}