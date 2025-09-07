import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "../../../devices/route";
import { prisma } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ rfidId: string }> }
) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );

  try {
    const params = await context.params;
    const rfidId = params.rfidId;

    const deleted = await prisma.rFID.delete({
      where: { id: rfidId },
    });

    return NextResponse.json(
      { success: true, message: "RFID deleted", data: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
