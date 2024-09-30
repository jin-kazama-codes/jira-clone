// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import s3Client from "@/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const CURRENT_DATE = Date.now();

async function uploadImageToS3(
  file: Buffer,
  fileName: string
): Promise<string> {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: `${CURRENT_DATE}-${fileName}`,
    Body: file,
    ContentType: "image/jpeg", // Change the content type accordingly
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return fileName;
}

// Main API route handler
export async function POST(request: NextRequest, response: NextResponse) {
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadImageToS3(
      buffer,
      uuid() + "." + fileExtension
    );

    return NextResponse.json({
      success: true,
      fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${CURRENT_DATE}-${fileName}`,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    NextResponse.json({ message: "Error uploading image" });
  }
}
