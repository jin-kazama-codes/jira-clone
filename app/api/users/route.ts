import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseCookies } from "@/utils/cookies";

const prisma = new PrismaClient();

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

        return NextResponse.json({ user: existingUser, member: newMember }, { status: 201 });
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

      return NextResponse.json({ user: newUser, member: newMember }, { status: 201 });
    }
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
