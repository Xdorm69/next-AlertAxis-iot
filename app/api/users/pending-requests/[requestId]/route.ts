
import { prisma } from "@/lib/db";
import { Prisma, RequestTypes } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/helpers/authHelpers";
import { handleRfidCreateRequest, handleRfidPortRequest, handleRfidStatusUpdate } from "@/lib/helpers/rfid/rfidServer";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );

  const adminId = admin.data?.id;
  if (!adminId) {
    return NextResponse.json(
      { success: false, error: "Admin not found" },
      { status: 401 }
    );
  }

  try {
    const { requestId } =await context.params;

    const pendingRequest = await prisma.pendingRfidRequests.findUnique({
      where: { id: requestId },
    });

    if (!pendingRequest) {
      return NextResponse.json(
        { success: false, error: "Request is not valid" },
        { status: 400 }
      );
    }

    const { requestType, rfidId, targetRfidId, userId } = pendingRequest;

    switch (requestType) {
      case RequestTypes.CREATE:
        if (!pendingRequest.tempTagId) {
          return NextResponse.json(
            { success: false, error: "tempTagId is required for CREATE" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          await handleRfidCreateRequest(
            requestId,
            userId,
            pendingRequest.tempTagId,
            adminId
          )
        );

      case RequestTypes.ACTIVATE:
        if (!rfidId) {
          return NextResponse.json(
            { success: false, error: "rfidId is required for ACTIVATE" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          await handleRfidStatusUpdate(requestId, rfidId, true, adminId)
        );

      case RequestTypes.DEACTIVATE:
        if (!rfidId) {
          return NextResponse.json(
            { success: false, error: "rfidId is required for DEACTIVATE" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          await handleRfidStatusUpdate(requestId, rfidId, false, adminId)
        );

      case RequestTypes.PORT:
        if (!rfidId || !targetRfidId) {
          return NextResponse.json(
            {
              success: false,
              error: "rfidId and targetRfidId required for PORT",
            },
            { status: 400 }
          );
        }
        return NextResponse.json(
          await handleRfidPortRequest(
            requestId,
            userId,
            rfidId,
            targetRfidId,
            adminId
          )
        );

      default:
        return NextResponse.json(
          { success: false, error: "Invalid request type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error handling pending RFID request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
