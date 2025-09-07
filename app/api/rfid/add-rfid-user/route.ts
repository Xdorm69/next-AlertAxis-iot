import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { RequestTypes } from "@prisma/client";
import { getUser } from "@/lib/helpers/authHelpers";
import {
  handleCreate,
  handleActivate,
  handleDeactivate,
  handlePort,
} from "@/lib/helpers/rfid/rfidClient";

export async function POST(request: NextRequest) {
  try {
    const dbUser = await getUser();
    if (!dbUser.success) {
      return NextResponse.json(
        { success: false, error: dbUser.error },
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

    if (!dbUser.data) {
      return NextResponse.json(
        { success: false, error: "No data found in dbUser" },
        { status: 400 }
      );
    }
    const user = dbUser.data;

    let result;

    switch (requestType) {
      case RequestTypes.CREATE:
        result = await handleCreate(tagId, user.id);
        break;
      case RequestTypes.ACTIVATE:
        result = await handleActivate(tagId, user.id);
        break;
      case RequestTypes.DEACTIVATE:
        result = await handleDeactivate(rfidId, user.id);
        break;
      case RequestTypes.PORT:
        result = await handlePort(rfidId, targetRfidId, user.id);
        break;
      default:
        return NextResponse.json(
          { success: false, error: "Invalid requestType" },
          { status: 400 }
        );
    }

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    const pending = await prisma.pendingRfidRequests.create({
      data: result.data,
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
