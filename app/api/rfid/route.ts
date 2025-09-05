import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    const data = await prisma.rFID.findMany({
      include: {
        user: { select: { id: true, username: true, email: true, name: true } },
        _count: {
          select: {
            accessLogs: true,
          },
        },
      },
    });

    const totalDataLength = await prisma.rFID.count();
    return NextResponse.json({data, totalDataLength}, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
