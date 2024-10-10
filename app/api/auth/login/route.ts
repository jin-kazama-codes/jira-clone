import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { DefaultUser } from "@prisma/client";

export async function POST(request: Request) {
  const { email, password }: Partial<DefaultUser> = await request.json();

  const user = await prisma.defaultUser.findFirst({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (password !== user.password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const userObj = {
    ...user,
  };
  delete userObj.password;

  return NextResponse.json(
    { message: "Login successful", user: userObj },
    { status: 200 }
  );
}



export async function PATCH(request: Request) {
  try {
    const { projectId, name, cloneChild } = await request.json();

    console.log("Request Data:", { projectId, name, cloneChild });

    // Ensure that projectId, name, and cloneChild are provided
    if (!projectId || !name || typeof cloneChild !== "boolean") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: { name, cloneChild }, // Update both name and cloneChild
    });

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

