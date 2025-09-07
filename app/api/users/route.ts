import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/helpers/authHelpers";
import { NextRequest, NextResponse } from "next/server";


export type UsersDataSchema = {
  id: string;
  username: string;
  role: "ADMIN" | "USER";
  email: string;
  _count: { rfids: number };
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
};

export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );

  const searchParams = new URL(request.url).searchParams;

  const roleFilter = searchParams.get("roleFilter") || "ALL" ; // ADMIN | USER | ALL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const dateFrom: string = searchParams.get("dateFrom") || "";
  const dateTo: string = searchParams.get("dateTo") || "";
  const search = searchParams.get("search") || "";

  try {
    const where: any = {
      ...(roleFilter !== "ALL" && { role: roleFilter }),
      ...(search && {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    if (
      dateFrom &&
      dateTo &&
      !isNaN(Date.parse(dateFrom)) &&
      !isNaN(Date.parse(dateTo))
    ) {
      where.createdAt = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const [usersFetched, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { rfids: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        users: usersFetched,
        totalCount,
        currentClerkUserId: admin.data?.clerkId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
