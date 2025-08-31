import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
};

const dummyAdminLogs: AccessLogWithUser[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    status: "GRANTED",
    user: { name: "Alice", email: "alice@example.com", role: "ADMIN" },
    rfid: { tagId: "RFID123" },
  },
  {
    id: "2",
    timestamp: new Date().toISOString(),
    status: "DENIED",
    user: { name: "Bob", email: "bob@example.com", role: "USER" },
    rfid: { tagId: "RFID456" },
  },
  {
    id: "3",
    timestamp: new Date().toISOString(),
    status: "GRANTED",
    user: { name: "Charlie", email: "charlie@example.com", role: "USER" },
    rfid: { tagId: "RFID789" },
  },
];

const dummyUserLogs: AccessLogWithUser[] = [
  {
    id: "101",
    timestamp: new Date().toISOString(),
    status: "GRANTED",
    user: { name: "Bob", email: "bob@example.com", role: "USER" },
    rfid: { tagId: "RFID456" },
  },
  {
    id: "102",
    timestamp: new Date().toISOString(),
    status: "DENIED",
    user: { name: "Bob", email: "bob@example.com", role: "USER" },
    rfid: { tagId: "RFID457" },
  },
  {
    id: "103",
    timestamp: new Date().toISOString(),
    status: "GRANTED",
    user: { name: "Bob", email: "bob@example.com", role: "USER" },
    rfid: { tagId: "RFID458" },
  },
];

export async function GET(request: NextRequest) {
  const user = await currentUser();
  if (!user) return redirect("/");

  // const dbUser = await prisma.user.findUnique({
  //     where: {
  //         clerkId: user.id,
  //     },
  // });

  const dbUser = {
    role: "ADMIN",
    name: "Amitoj Singh",
    email: "amitoj.mehta@gmail.com",
  };

  if (!dbUser) return redirect("/sync");

  const searchParams = new URL(request.url).searchParams;
  const statusFilter = searchParams.get("statusFilter");
  const roleFilter = searchParams.get("roleFilter");

  if (dbUser.role === "ADMIN") {
    const data = filterData(dummyAdminLogs, statusFilter, roleFilter);
    return NextResponse.json(data);
  }

  const data = filterData(dummyUserLogs, statusFilter, roleFilter);
  return NextResponse.json(data);
}

const filterData = (
  logs: AccessLogWithUser[],
  status: string | null,
  role: string | null
) => {
  return logs.filter((log) => {
    const statusMatch = !status || status === "ALL" || log.status === status;
    const roleMatch = !role || role === "ALL" || log.user.role === role;
    return statusMatch && roleMatch;
  });
};
