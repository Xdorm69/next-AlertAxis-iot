import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/helpers/authHelpers";


export async function POST(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success) return NextResponse.json({success: false, error: admin.error}, {status: 401});
  try {
    const { tagId } = await request.json();

    if (!tagId)
      return NextResponse.json(
        { success: false, error: "tagId is required" },
        { status: 400 }
      );

    const add = await prisma.rFID.create({
        data: {
            tagId,
            active: true,
            userId: admin.data?.id as string,
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
