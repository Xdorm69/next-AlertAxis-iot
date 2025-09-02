import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, phone, role, secretKey } = body;
    if (role === "ADMIN") {
      if (!secretKey)
        return NextResponse.json(
          { error: "Secret key not found" },
          { status: 401 }
        );
      if (secretKey !== process.env.ADMIN_SECRET_KEY)
        return NextResponse.json(
          { error: "Invalid secret key" },
          { status: 401 }
        );
    }
    const user = await currentUser();
    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const usernameCheck = await prisma.user.findUnique({
      where: { username },
    });

    if (usernameCheck)
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 401 }
      );

    await prisma.user.create({
      data: {
        clerkId: user.id,
        username,
        phone,
        role,
        ...(role === "ADMIN" ? { adminSince: new Date() } : {}),
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
