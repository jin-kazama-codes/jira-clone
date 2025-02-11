import { prisma } from "@/server/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id); 

    const { name, email, password, role, companyId } = await req.json();

    // Check if the admin exists
    const existingAdmin = await prisma.defaultUser.findUnique({
      where: { id: userId }, // Find user by ID
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If email is being updated, check if it's already in use by another admin
    if (email && email !== existingAdmin.email) {
      const emailExists = await prisma.defaultUser.findFirst({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 401 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    

    // Prepare the update data object
    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = hashedPassword; 
    if (role) updateData.role = role;
    if (companyId) updateData.companyId = parseInt(companyId);

    // Update the user
    const updatedUser = await prisma.defaultUser.update({
      where: { id: userId }, // Find user by ID
      data: updateData, // Update with the provided data
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
