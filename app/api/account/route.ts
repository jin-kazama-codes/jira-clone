import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: 1,
      },
    });

    return NextResponse.json({ account }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, contactNumber, logo } = await req.json();

    // First try to find the account
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: 1,
      },
    });

    let account;

    if (existingAccount) {
      // Update existing account
      account = await prisma.account.update({
        where: {
          id: 1,
        },
        data: {
          name,
          contact: parseInt(contactNumber),
          logo,
        },
      });
    } else {
      // Create new account
      account = await prisma.account.create({
        data: {
          id: 1,
          name,
          contact: parseInt(contactNumber),
          logo,
        },
      });
    }

    return NextResponse.json({ account: account });
  } catch (error) {
    console.error("Error handling account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
