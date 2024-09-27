import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { DefaultUser } from "@prisma/client";

export async function POST(request: Request) {
  const { email, password }: Partial<DefaultUser> = await request.json();

  const user = await prisma.defaultUser.findFirst({
    where: { email },
  });

  console.log("User", user)

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
