import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import s3Client from "@/s3";
import { toast } from "@/components/toast";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  const { documentId } = params;
  const documentIdStr = Number(documentId);
  const { searchParams } = new URL(req.url);
  const isFolder = searchParams.get("folder") === "true";

  const deleteFromS3 = async (s3Url: string) => {
    if (!s3Url) return true; // Skip if no URL provided

    const s3UrlRegex = /^https:\/\/([^/]+)\.s3\.amazonaws\.com\/(.+)$/;
    const match = s3Url.match(s3UrlRegex);

    if (!match) {
      console.error("Invalid S3 URL:", s3Url);
      return false;
    }

    const bucketName = match[1];
    const objectKey = decodeURIComponent(match[2]);

    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });
      await s3Client.send(deleteCommand);
      return true;
    } catch (error) {
      toast.error("Failed to delete file from S3:", error);
      return false;
    }
  };

  const deleteFilesAndFolders = async (folderId: number): Promise<boolean> => {
    try {
      // Find all documents in the folder
      const folderFiles = await prisma.document.findMany({
        where: { parentId: folderId },
      });

      // Process all files in the folder
      for (const file of folderFiles) {
        if (file.link) {
          // Delete file from S3 if it has a link
          // if change a settings in s3 wait a few hours and try again
          const success = await deleteFromS3(file.link);
          if (!success) {
            throw new Error(`Failed to delete file from S3: ${file.link}`);
          }
        } else {
          // Recursively delete nested folders
          const success = await deleteFilesAndFolders(file.id);
          if (!success) {
            throw new Error(`Failed to delete nested folder: ${file.id}`);
          }
        }
      }

      // Delete all documents in the folder
      await prisma.document.deleteMany({
        where: { parentId: folderId },
      });

      // Delete the folder itself
      await prisma.document.delete({
        where: { id: folderId },
      });

      return true;
    } catch (error) {
      toast.error("Error in deleteFilesAndFolders:", error);
      return false;
    }
  };

  try {
    if (isFolder) {
      const success = await deleteFilesAndFolders(documentIdStr);
      if (!success) {
        return new Response("Failed to delete folder and its contents", {
          status: 500,
        });
      }
      return new Response("Folder and all files deleted successfully", {
        status: 200,
      });
    } else {
      // Find and delete single document
      const document = await prisma.document.findUnique({
        where: { id: documentIdStr },
      });

      if (!document) {
        return new Response("Document not found", { status: 404 });
      }

      if (document.link) {
        const success = await deleteFromS3(document.link);
        if (!success) {
          return new Response("Failed to delete file from S3", { status: 500 });
        }
      }

      await prisma.document.delete({
        where: { id: documentIdStr },
      });

      return new Response("Document and file deleted successfully", {
        status: 200,
      });
    }
  } catch (error) {
    toast.error("Error deleting document or folder:", error);
    return new Response("Failed to delete document or folder", { status: 500 });
  }
}
