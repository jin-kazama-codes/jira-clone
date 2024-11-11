import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const { to, subject, html } = await request.json();

  if (!to) {
    return NextResponse.json({ message: 'No recipient email provided' }, { status: 400 });
  }
  // Configure Nodemailer transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "atechno27@gmail.com",
      pass: "xplt mjdc hkpf xpkm",
    },
  });

  try {
    // Send email
    await transporter.sendMail({
      from: "atechno27@gmail.com",
      to,
      subject,
      html,
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { message: 'Failed to send email', error: (error as Error).message },
      { status: 500 }
    );
  }
}
