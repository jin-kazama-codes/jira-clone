import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { DefaultUser } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password }: Partial<DefaultUser> = await request.json();

  const user = await prisma.defaultUser.findFirst({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isPasswordHashed = user.password.startsWith("$2");
  let isMatch;

  if (isPasswordHashed) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    isMatch = password === user.password;
  }

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Omit password from response
  const { password: _, ...userWithoutPassword } = user;
  let role = user.role;

  // If role is not superAdmin or admin from defaultUser table
  if (role !== "superAdmin" && role !== "admin") {
    const memberships = await prisma.member.findMany({
      where: {
        id: user.id,
      },
    });
  
    if (memberships.length > 0) {
      const isManager = memberships.some((m) => m.manager === true);
      role = isManager ? "manager" : "member";
    } else {
      role = "member"; // Fallback if no memberships found
    }
  }
  
  const finalUser = {
    ...userWithoutPassword,
    role,
  };
  

  return NextResponse.json(
    { message: "Login successful", user: finalUser },
    { status: 200 }
  );
}


export async function PATCH(request: Request) {
  try {
    const { projectId, name, cloneChild, workingDays, showAssignedTasks } =
      await request.json();

    // Ensure that projectId, name, and cloneChild are provided
    if (
      !projectId ||
      !name ||
      typeof cloneChild !== "boolean" ||
      !workingDays
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: { name, cloneChild, workingDays, showAssignedTasks }, // Update both name and cloneChild
    });

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
