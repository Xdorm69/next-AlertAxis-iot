import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export type AccessLogWithUser = {
  id: string;
  timestamp: string;
  status: "GRANTED" | "DENIED";
  user: {
    name: string | null;
    email: string;
    role: "ADMIN" | "USER";
  };
  rfid: {
    tagId: string;
  };
  device: {
    name: string;
  };
};

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not synced" }, { status: 403 });
  }

  const searchParams = new URL(request.url).searchParams;
  const statusFilter = searchParams.get("statusFilter"); // ALL | GRANTED | DENIED
  const roleFilter = searchParams.get("roleFilter"); // ALL | ADMIN | USER
  const page = Number(searchParams.get("page"));
  const dateFrom: string = searchParams.get("dateFrom") || "";
  const dateTo: string = searchParams.get("dateTo") || "";
  const search = searchParams.get("search") || "";

  try {
    const where: any = {
      ...(statusFilter && statusFilter !== "ALL" && { status: statusFilter }),
      ...(roleFilter && roleFilter !== "ALL" && { user: { role: roleFilter } }),
      ...(dateFrom &&
        dateTo && {
          timestamp: {
            gte: dateFrom,
            lte: dateTo,
          },
        }),
      ...(search && {
        OR: [
          {
            user: {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
              ],
            },
          },
          {
            device: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }),
      ...(dbUser.role?.toUpperCase() === "USER" && { userId: dbUser.id }),
    };


    const [data, count] = await prisma.$transaction([
      prisma.accessLog.findMany({
        where,
        include: {
          user: true,
          device: true,
          rfid: true,
        },
        orderBy: {
          timestamp: "desc",
        },
        skip: page === 1 ? 0 : page * 10,
        take: 10,
      }),
      prisma.accessLog.count({ where }),
    ]);

    return NextResponse.json({ APIData: { data }, count });
  } catch (error) {
    console.error("Error fetching access logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch access logs" },
      { status: 500 }
    );
  }
}
