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

  //DBUSER FOR TESTING PURPOSE
  // const dbUser = await prisma.user.findUnique({
  //   where: { id: "cmf0qi3ch0001g8ccelc8728l" },
  // });

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

  console.log("SEARCH QUERY: ", search);

  try {
    const [data, count] = await prisma.$transaction([
      prisma.accessLog.findMany({
        where: {
          ...(dbUser.role?.toUpperCase() === "USER" && { userId: dbUser.id }),
          ...(statusFilter &&
            statusFilter !== "ALL" && {
              status: statusFilter as "GRANTED" | "DENIED",
            }),
          ...(roleFilter &&
            roleFilter !== "ALL" && {
              user: { role: roleFilter as "ADMIN" | "USER" },
            }),
          ...(dateFrom &&
            dateTo && {
              timestamp: {
                gte: new Date(dateFrom),
                lte: (() => {
                  const end = new Date(dateTo);
                  end.setHours(23, 59, 59, 999);
                  return end;
                })(),
              },
            }),
          ...(search
            ? {
                OR: [
                  {
                    user: {
                      is: { name: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    user: {
                      is: {
                        username: { contains: search, mode: "insensitive" },
                      },
                    },
                  },
                  {
                    user: {
                      is: { email: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    rfid: {
                      is: { tagId: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    device: {
                      is: { name: { contains: search, mode: "insensitive" } },
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          user: { select: { name: true, email: true, role: true } },
          rfid: { select: { tagId: true } },
          device: { select: { name: true } },
        },
        ...(search ? {} : { skip: page * 10 }),
        take: 10,
        orderBy: { timestamp: "desc" },
      }),

      prisma.accessLog.count({
        where: {
          ...(dbUser.role?.toUpperCase() === "USER" && { userId: dbUser.id }),
          ...(statusFilter &&
            statusFilter !== "ALL" && {
              status: statusFilter as "GRANTED" | "DENIED",
            }),
          ...(roleFilter &&
            roleFilter !== "ALL" && {
              user: { role: roleFilter as "ADMIN" | "USER" },
            }),
          ...(dateFrom &&
            dateTo && {
              timestamp: {
                gte: new Date(dateFrom),
                lte: (() => {
                  const end = new Date(dateTo);
                  end.setHours(23, 59, 59, 999);
                  return end;
                })(),
              },
            }),
          ...(search
            ? {
                OR: [
                  {
                    user: {
                      is: { name: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    user: {
                      is: {
                        username: { contains: search, mode: "insensitive" },
                      },
                    },
                  },
                  {
                    user: {
                      is: { email: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    rfid: {
                      is: { tagId: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    device: {
                      is: { name: { contains: search, mode: "insensitive" } },
                    },
                  },
                ],
              }
            : {}),
        },
      }),
    ]);

    return NextResponse.json({ APIData: {data}, count });
  } catch (error) {
    console.error("Error fetching access logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch access logs" },
      { status: 500 }
    );
  }
}
