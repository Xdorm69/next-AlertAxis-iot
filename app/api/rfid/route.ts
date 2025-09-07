import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/helpers/authHelpers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json({ success: false, error: admin.error }, { status: 401 });

  const searchParams = new URL(request.url).searchParams;

  try {
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

    return NextResponse.json({ success: true, data, totalDataLength }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}


