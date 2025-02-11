import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const companies = await prisma.company.findMany();

    return NextResponse.json({ companies: companies }, { status: 200 });
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
    const {
      name,
      website,
      email,
      phone,
      alternateNumber,
      billingAddress,
      gst,
      subscriptionType,
      trialDuration,
      date,
      status,
      proMember
    } = await req.json();

    // Check if a company with the same email already exists
    const existingCompany = await prisma.company.findFirst({
      where: { email },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Email already exists in this project" },
        { status: 401 }
      );
    }

    // Create a data object with only the provided fields
    const data: any = {
      name,
      email,
      phone,
      billingAddress,
      gst,
      subscriptionType,
      date,
      status,
      proMember
    };

    // Add optional fields only if they are provided
    if (website) data.website = website;
    if (alternateNumber) data.alternateNumber = alternateNumber;
    if (trialDuration) data.trialDuration = trialDuration;

    // Create the new company
    const newCompany = await prisma.company.create({
      data,
    });

    return NextResponse.json({ company: newCompany }, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
