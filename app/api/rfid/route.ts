import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const clerkUser = await auth();
  const id = clerkUser.userId;
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await prisma.rFID.findMany();
    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
