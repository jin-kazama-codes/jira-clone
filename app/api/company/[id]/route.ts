import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string | number } }
) {
  try {
    const companyId = parseInt(params.id);

    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
      },
    });

    return NextResponse.json({ company: company }, { status: 200 });
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = parseInt(params.id);
    
    // Extract fields from request body
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
      logo,
      bio,
      proMember
    } = await req.json();

    // Check if the company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!existingCompany) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Create update object with only provided fields
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (billingAddress !== undefined) updateData.billingAddress = billingAddress;
    if (gst !== undefined) updateData.gst = gst;
    if (subscriptionType !== undefined) updateData.subscriptionType = subscriptionType;
    if (date !== undefined) updateData.date = date;
    if (status !== undefined) updateData.status = status;
    if (website !== undefined) updateData.website = website;
    if (alternateNumber !== undefined) updateData.alternateNumber = alternateNumber;
    if (trialDuration !== undefined) updateData.trialDuration = trialDuration;
    if (logo !== undefined) updateData.logo = logo;
    if (bio !== undefined) updateData.bio = bio;
    if (proMember !== undefined) updateData.proMember = proMember;


    // Update the company
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
    });

    return NextResponse.json({ company: updatedCompany }, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
