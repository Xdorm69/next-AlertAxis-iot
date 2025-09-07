import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "../../devices/route";
import { success } from "zod";
import { prisma } from "@/lib/db";


export async function POST(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success) return NextResponse.json({success: false, error: admin.error}, {status: 401});
  try {
    const { tagId, status, userId } = await request.json();

    if (!tagId || !status || !userId)
      return NextResponse.json(
        { success: false, error: "tagId, status, userId is required" },
        { status: 400 }
      );

    const add = await prisma.rFID.create({
        data: {
            tagId,
            active: Boolean(status),
            userId
        }
    })

    return NextResponse.json({success: true, message: "RFID added", data: add}, {status: 201});

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
