import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/helpers/authHelpers";

export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );
  }

  try {
    const searchParams = new URL(request.url).searchParams;
    const search = searchParams.get("search") || "";

    const requests = await prisma.pendingRfidRequests.findMany({
      include: {
        user: {
          select: { id: true, username: true, email: true, name: true },
        },
        rfid: { select: { id: true, tagId: true } },
      },
      orderBy: { approvedByAdmin: "desc" },
      take: 10,
      where: search
        ? {
            OR: [
              { id: { contains: search, mode: "insensitive" } },
              { userId: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
    });

    return NextResponse.json(
      { success: true, data: requests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error from /api/users/pending-requests: GET", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
