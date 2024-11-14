import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseCookies } from "@/utils/cookies";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.defaultUser.findMany();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    const { id: projectId } = parseCookies(req, "project");

    const existingUser = await prisma.defaultUser.findFirst({
      where: { email },
    });

    if (existingUser) {
      const existingMember = await prisma.member.findFirst({
        where: {
          id: existingUser.id,
          projectId,
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: "Email already exists in this project" },
          { status: 401 }
        );
      } else {
        const newMember = await prisma.member.create({
          data: {
            id: existingUser.id,
            projectId,
          },
        });

        return NextResponse.json(
          { user: existingUser, member: newMember },
          { status: 201 }
        );
      }
    } else {
      const newUser = await prisma.defaultUser.create({
        data: { name, email },
      });

      const newMember = await prisma.member.create({
        data: {
          id: newUser.id,
          projectId,
        },
      });

      return NextResponse.json(
        { user: newUser, member: newMember },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.defaultUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user with provided fields
    const updatedUser = await prisma.defaultUser.update({
      where: { id },
      data: {
        ...(name && { name }),
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const projectId = parseCookies(req, "project").id;
    const { userId } = await req.json();

    // Validate projectId and userId
    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Project ID and User ID are required" },
        { status: 400 }
      );
    }

    // Delete the specific record by its unique ID
    await prisma.member.deleteMany({
      where: {
        AND: [
          {id: userId},
          {projectId : projectId}
        ]
      },
    });

    return NextResponse.json(
      { message: "User successfully deleted from the project" },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



