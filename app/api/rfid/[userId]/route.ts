import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const paramUserId = params.userId;

    if (paramUserId) {
      const [rfids, user] = await prisma.$transaction([
        prisma.rFID.findMany({
          where: { userId: paramUserId },
          include: {
            accessLogs: {
              include: { device: true },
              orderBy: { timestamp: "desc" },
            },
          },
        }),
        prisma.user.findUnique({ where: { id: paramUserId } }),
      ]);

      // enrich RFID data
      const enrichedRfids = rfids.map((rfid) => {
        const accessLogs = rfid.accessLogs;

        // latest log
        const lastLog = accessLogs[0];

        // last used
        const lastUsedAt = lastLog?.timestamp || null;

        // total access attempts
        const accessAttempts = accessLogs.length;

        // last device
        const lastAccessDevice = lastLog?.device || null;

        // last 3 unique devices used
        const recentDevicesUsed = [
          ...new Map(
            accessLogs.slice(0, 10).map((log) => [log.deviceId, log.device])
          ).values(),
        ].slice(0, 3);

        // access breakdown for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentLogs = accessLogs.filter(
          (log) => log.timestamp >= sevenDaysAgo
        );

        const accessResultBreakdown: Record<
          string,
          { date: string; GRANTED: number; DENIED: number }
        > = {};

        // pre-fill last 7 days
        for (let i = 0; i < 7; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const day = d.toISOString().split("T")[0];
          accessResultBreakdown[day] = {
            date: day,
            GRANTED: 0,
            DENIED: 0,
          };
        }

        recentLogs.forEach((log) => {
          const day = log.timestamp.toISOString().split("T")[0];
          if (!accessResultBreakdown[day]) {
            accessResultBreakdown[day] = {
              date: day,
              GRANTED: 0,
              DENIED: 0,
            };
          }
          accessResultBreakdown[day][log.status] += 1;
        });

        const histogramData = Object.values(accessResultBreakdown).reverse();

        return {
          ...rfid,
          lastUsedAt,
          accessAttempts,
          lastAccessDevice,
          recentDevicesUsed,
          accessResultBreakdown: histogramData,
        };
      });

      const mergedHistogram: Record<
        string,
        { date: string; GRANTED: number; DENIED: number }
      > = {};

      // combine counts across all RFIDs
      enrichedRfids.forEach((rfid) => {
        rfid.accessResultBreakdown.forEach((day) => {
          if (!mergedHistogram[day.date]) {
            mergedHistogram[day.date] = {
              date: day.date,
              GRANTED: 0,
              DENIED: 0,
            };
          }
          mergedHistogram[day.date].GRANTED += day.GRANTED;
          mergedHistogram[day.date].DENIED += day.DENIED;
        });
      });

      const chartData = Object.values(mergedHistogram).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      return NextResponse.json({
        rfidData: enrichedRfids,
        userData: user,
        charts: {
          histogram: chartData, // ✅ already flattened
        },
      });
    }

    return NextResponse.json({ rfidData: [], userData: [] }, { status: 400 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
