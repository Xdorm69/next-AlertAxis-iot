
import { prisma } from "@/lib/db";
import { getUser} from "@/lib/helpers/authHelpers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  context : { params: Promise<{ userId: string }> }
) {
  const user = await getUser();
  if(!user.success) return NextResponse.json({success: false, error: user.error}, { status: 401 });

  const params = await context.params;
  const userId = params.userId;

  const rfids = await prisma.rFID.findMany({
    where: { userId },
    include: {
      accessLogs: {
        include: { device: true },
        orderBy: { timestamp: "desc" },
        take: 10,
      },
    },
  });

  const optimized = rfids.map((rfid) => {
    return {
      id: rfid.id,
      tagId: rfid.tagId,
      recentDevicesUsed: [
        ...new Map(
          rfid.accessLogs.map((log) => [log.deviceId, log.device])
        ).values(),
      ].slice(0, 3),
    };
  });

  return NextResponse.json({success: true, data: optimized});
}
