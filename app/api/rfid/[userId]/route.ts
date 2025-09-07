import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "../../devices/route";



// GET → raw RFID record
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json({ success: false, error: admin.error }, { status: 401 });

  const params = await context.params;
  const userId = params.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      rfids: {
        include: {
          accessLogs: {
            include: { device: true },
            orderBy: { timestamp: "desc" },
          },
        },
      },
    },
  });

  if (!user)
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

  // enrich each RFID
  const enrichedRfids = user.rfids.map((rfid) => {
    const logs = rfid.accessLogs;
    const lastLog = logs[0];

    return {
      id: rfid.id,
      tagId: rfid.tagId,
      active: rfid.active,
      createdAt: rfid.createdAt,
      lastUsedAt: lastLog?.timestamp ?? null,
      accessAttempts: logs.length,
      lastAccessDevice: lastLog?.device ?? null,
    };
  });

  return NextResponse.json({
    rfids: enrichedRfids,
  });
}


// PATCH → update RFID status
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json({ success: false, error: admin.error }, { status: 401 });

  const { active } = await req.json();

  const params = await context.params;
  const rfidId = params.userId;

  console.log("RFID ID: ", rfidId);

  const updated = await prisma.rFID.update({
    where: { id: rfidId },
    data: { active },
  });

  return NextResponse.json({ success: true, message: "RFID updated", updated });
}
