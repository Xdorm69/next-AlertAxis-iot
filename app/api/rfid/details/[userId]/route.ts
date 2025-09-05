import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function getUser() {
  const clerkUser = await auth();
  const id = clerkUser.userId;
  if (!id) return null;

  return prisma.user.findUnique({ where: { clerkId: id } });
}

export async function GET(
  req: NextRequest,
  context : { params: Promise<{ userId: string }> }
) {
  const dbUser = await getUser();
  if (!dbUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (dbUser.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const params = await context.params;
  const userId = params.userId;

  const rfids = await prisma.rFID.findMany({
    where: { userId },
    include: {
      accessLogs: {
        include: { device: true },
        orderBy: { timestamp: "desc" },
        take: 10, // only latest logs
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
      ].slice(0, 3), // at most 3 devices
    };
  });

  return NextResponse.json(optimized);
}
