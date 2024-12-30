import { parseCookies } from "@/utils/cookies";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse JSON from the request body
    const { type, link, name, extension, parentId } = await req.json();
    console.log("Parsed body:", { type, link, name, extension, parentId });

    const { id: projectId } = parseCookies(req, "project");
    const { id: ownerId } = parseCookies(req, "user");

    // Validate required fields
    if (!type || !name) {
      return NextResponse.json(
        {
          error: "Missing required fields: type, name.",
        },
        { status: 401 }
      );
    }
    // Validate type value
    if (!["file", "folder"].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "file" or "folder".' },
        { status: 400 }
      );
    }
    // Create resource in the database
    const newDocument = await prisma.document.create({
      data: {
        type,
        ownerId,
        link: link || null,
        projectId,
        name,
        extensions: extension || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ document: newDocument }, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get api

export async function GET(req: Request) {
  try {
    const { id } = parseCookies(req, "project");
    const url = new URL(req.url);
    const parentId = url.searchParams.get("parentId");
    const documents = await prisma.document.findMany({
      where: {
        projectId: id,
        parentId: parentId === "null" ? null : Number(parentId),
      },
      include: { DefaultUser: true },
    });

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
