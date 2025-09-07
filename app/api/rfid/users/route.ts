import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "../../devices/route";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success) {
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";

    const usernames = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        username: true,
        id: true
      },
      take: 5,
    });

    return NextResponse.json(
      { success: true, data: usernames },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/your-route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
