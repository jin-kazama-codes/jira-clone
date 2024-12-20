import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;
  const documentIdStr = Number(documentId);
  console.log("idsssss??", documentId, documentIdStr);
  try {
    // Find the Document
    const document = await prisma.document.findUnique({
      where: { id: documentIdStr },
    });
    console.log("document", document);

    if (!document) {
      return new Response("Document not found", { status: 404 });
    }

    await prisma.document.delete({
      where: { id: documentIdStr },
    });

    return new Response("Document deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error delete Document:", error);
    return new Response("Failed to delete Document", { status: 500 });
  }
}
