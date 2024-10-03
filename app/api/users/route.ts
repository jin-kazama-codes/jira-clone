import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getQueryClient } from "@/utils/get-query-client";
import { parseCookies } from "@/utils/cookies";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    const { id: projectId } = parseCookies(req, "project");

    console.log("Project IDDDDDDDDDDDDDDD", projectId)

    // Check if the user already exists in the database
    const checkUser = await prisma.defaultUser.findMany({
      where: {
        email: email,
      },
    });

    console.log("CHECKUSER", checkUser?.id)
    if (checkUser.length) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 401 }
      );
    }

    const user = await prisma.defaultUser.create({
      data: {
        name,
        email,
      },
    });

    console.log("USEERR", user)

    const member = await prisma.member.create({
      data: {
        id: user.id,
        projectId: projectId,
      },
    });

    return NextResponse.json({ user, member }, { status: 201 });

  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
