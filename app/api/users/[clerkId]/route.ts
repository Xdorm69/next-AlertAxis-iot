import { prisma } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ clerkId: string }> }
) {
  const user = await auth();
  const id = user?.userId;
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { clerkId: paramsId } = await context.params;
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (dbUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const isUserActive = await isUserLoggedIn(paramsId);
    const activeUserRole = await prisma.user.findUnique({
      where: { clerkId: paramsId },
      select: { role: true },
    });

    return NextResponse.json({ isUserActive, activeUserRole }, { status: 200 });
  } catch (error) {
    console.log("Error from /api/users/[id]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { clerkId: string } }
) {
  const user = await auth();
  const id = user?.userId;
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const paramsId = params.clerkId;
  const { role, secret: SecretFromClient } = await request.json();

  try {
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (dbUser.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userToChange = await prisma.user.findUnique({
      where: { clerkId: paramsId },
    });
    if (!userToChange)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (userToChange.role === "ADMIN") {
      const secret = process.env.ADMIN_TO_USER_SECRET_KEY;
      if (!SecretFromClient)
        return NextResponse.json(
          { error: "A key is required to change admin to user" },
          { status: 401 }
        );
      if (secret !== SecretFromClient)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({ where: { clerkId: paramsId }, data: { role } });

    return NextResponse.json(
      { message: "User role updated successfully", userToChange },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error from /api/users/[id]: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function isUserLoggedIn(clerkId: string) {
  // Fetch sessions from Clerk
  const sessions = await (
    await clerkClient()
  ).sessions.getSessionList({
    userId: clerkId,
  });

  // Safely pass to parser
  return parseUserSessionInfo(sessions.data || []);
}

export function parseUserSessionInfo(sessions: any[]) {
  if (!sessions.length) {
    return { loggedIn: false, lastLoggedInAt: null };
  }

  // Step 1: check if any active session exists
  const loggedIn = sessions.some((s) => s.status === "active");

  // Step 2: latest session = sessions[0]
  const lastLoggedInAt = sessions[0].latestActivity;

  return { loggedIn, lastLoggedInAt };
}
