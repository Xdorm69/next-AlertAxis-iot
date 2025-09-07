import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";
import { RequestTypes } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = getAuth(request);
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { requestType, tagId, rfidId, targetRfidId } = await request.json();

    if (!requestType) {
      return NextResponse.json(
        { success: false, error: "requestType is required" },
        { status: 400 }
      );
    }

    // 🔹 Find the user
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let pendingRequestData: any = {
      requestType,
      user: { connect: { id: user.id } },
    };

    // 🔹 Preload RFID if provided (for rules)
    let existingRfid = null;

    switch (requestType) {
      case RequestTypes.CREATE: {
        if (!tagId)
          return NextResponse.json(
            { error: "tagId required" },
            { status: 400 }
          );

        existingRfid = await prisma.rFID.findUnique({ where: { tagId } });
        if (existingRfid) {
          return NextResponse.json(
            { error: "RFID already exists" },
            { status: 400 }
          );
        }

        pendingRequestData.tempTagId = tagId;
        break;
      }

      case RequestTypes.ACTIVATE: {
        if (!tagId)
          return NextResponse.json(
            { error: "tagId required" },
            { status: 400 }
          );

        existingRfid = await prisma.rFID.findUnique({ where: { tagId } });
        if (!existingRfid)
          return NextResponse.json(
            { error: "RFID not found" },
            { status: 404 }
          );
        if (existingRfid.active)
          return NextResponse.json(
            { error: "Already active" },
            { status: 400 }
          );
        if (existingRfid.userId !== user.id)
          return NextResponse.json({ error: "Not your RFID" }, { status: 403 });

        // ✅ FIXED: use relation field
        pendingRequestData.rfid = { connect: { id: existingRfid.id } };
        break;
      }

      case RequestTypes.DEACTIVATE: {
        if (!rfidId)
          return NextResponse.json(
            { error: "rfidId required" },
            { status: 400 }
          );

        existingRfid = await prisma.rFID.findUnique({ where: { id: rfidId } });
        if (!existingRfid)
          return NextResponse.json(
            { error: "RFID not found" },
            { status: 404 }
          );
        if (!existingRfid.active)
          return NextResponse.json(
            { error: "Already deactivated" },
            { status: 400 }
          );
        if (existingRfid.userId !== user.id)
          return NextResponse.json({ error: "Not your RFID" }, { status: 403 });

        pendingRequestData.rfid = { connect: { id: existingRfid.id } };
        break;
      }

      case RequestTypes.PORT: {
        if (!rfidId || !targetRfidId) {
          return NextResponse.json(
            { error: "rfidId and targetRfidId required" },
            { status: 400 }
          );
        }

        const source = await prisma.rFID.findUnique({ where: { id: rfidId } });
        if (!source)
          return NextResponse.json(
            { error: "Source not found" },
            { status: 404 }
          );
        if (source.userId !== user.id)
          return NextResponse.json({ error: "Not your RFID" }, { status: 403 });

        const target = await prisma.rFID.findUnique({
          where: { id: targetRfidId },
        });
        if (!target)
          return NextResponse.json(
            { error: "Target not found" },
            { status: 404 }
          );
        if (target.active)
          return NextResponse.json(
            { error: "Target already active" },
            { status: 400 }
          );

        pendingRequestData.rfid = { connect: { id: rfidId } };
        pendingRequestData.targetRfid = { connect: { id: targetRfidId } };
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid requestType" },
          { status: 400 }
        );
    }

    // 🔹 Create pending request only
    const pending = await prisma.pendingRfidRequests.create({
      data: pendingRequestData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "RFID request submitted successfully",
        data: pending,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add RFID User Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
