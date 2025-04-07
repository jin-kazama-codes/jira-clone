// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import s3Client from "@/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const CURRENT_DATE = Date.now();

async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${CURRENT_DATE}-${fileName}`,
    Body: file,
    ContentType: contentType,
    ContentDisposition: "attachment",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return fileName;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as Blob | null;
    if (!file) {
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    const fileExtension = mimeType.split("/")[1];

    // Supported MIME types
    const supportedMimeTypes: Record<string, string> = {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "application/pdf": "pdf",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    };

    if (!Object.keys(supportedMimeTypes).includes(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported file type." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(
      buffer,
      uuid() + "." + supportedMimeTypes[mimeType],
      mimeType
    );

    return NextResponse.json({
      success: true,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${CURRENT_DATE}-${fileName}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
}
