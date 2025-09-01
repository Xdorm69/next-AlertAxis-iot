import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Device, RFID } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type UsersDataSchema = {
  id: string;
  email: string;
  username: string;
  rfids: RFID[];
  devices: Device[];
  role: "ADMIN" | "USER";
  createdAt: Date;
  updatedAt: Date;
};

export async function GET(request: NextRequest) {
  const user = await auth();
  const id = user.userId;
  if (!id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        rfids: true,
        devices: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
