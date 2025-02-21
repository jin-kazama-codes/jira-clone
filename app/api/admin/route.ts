import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admins = await prisma.defaultUser.findMany({
      where: {
        role: "admin",
      },
      include: { Company: true },
    });

    return NextResponse.json({ admins: admins }, { status: 200 });
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
    const { name, email, password, role, companyId } = await req.json();

    // Check if a user with the same email already exists
    const existingUser = await prisma.defaultUser.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a data object with only the provided fields
    const data: any = {
      name,
      email,
      password: hashedPassword,
      role,
      companyId: parseInt(companyId),
    };

    // Create the new user
    const newUser = await prisma.defaultUser.create({
      data,
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
