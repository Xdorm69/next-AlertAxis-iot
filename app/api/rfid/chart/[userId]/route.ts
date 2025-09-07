
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/helpers/authHelpers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context : { params: Promise<{ userId: string }> }
) {
  const user = await getUser();
  if (!user.success)
    return NextResponse.json({ success: false, error: user.error }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const daysParam = searchParams.get("days");
  const days = daysParam ? Math.min(Number(daysParam), 30) : 10;
  // max 30 days for safety, default 10
  const params = await context.params;
  const userId = params.userId;
  const rfids = await prisma.rFID.findMany({
    where: { userId },
    include: {
      accessLogs: {
        orderBy: { timestamp: "desc" },
        take: 50, // fetch more so we have enough logs to cover `days`
      },
    },
  });

  // Pre-fill last `days` days
  const merged: Record<
    string,
    { date: string; GRANTED: number; DENIED: number }
  > = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toISOString().split("T")[0];
    merged[day] = { date: day, GRANTED: 0, DENIED: 0 };
  }

  // Only include logs within cutoff
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));

  rfids.forEach((rfid) => {
    rfid.accessLogs.forEach((log) => {
      if (log.timestamp >= cutoff) {
        const day = log.timestamp.toISOString().split("T")[0];
        if (merged[day]) {
          merged[day][log.status] += 1;
        }
      }
    });
  });

  const chartData = Object.values(merged).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return NextResponse.json({ success: true, histogram: chartData });
}
