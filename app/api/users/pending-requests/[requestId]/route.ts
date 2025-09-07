import { getAdmin } from "@/app/api/devices/route";
import { prisma } from "@/lib/db";
import { Prisma, RequestTypes } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: { requestId: string } }
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
    const { requestId } = context.params;

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

/* ----------------- Helpers ----------------- */

type RfidStatusUpdateReturnType = {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    rfid: Prisma.RFIDGetPayload<{}>;
    request: Prisma.PendingRfidRequestsGetPayload<{}>;
  };
};

const handleRfidStatusUpdate = async (
  requestId: string,
  rfidId: string,
  active: boolean,
  adminId: string
): Promise<RfidStatusUpdateReturnType> => {
  try {
    const [rfid, request] = await prisma.$transaction([
      prisma.rFID.update({
        where: { id: rfidId },
        data: { active },
      }),
      prisma.pendingRfidRequests.update({
        where: { id: requestId },
        data: { approvedByAdmin: adminId },
      }),
    ]);

    return {
      success: true,
      message: "RFID status updated and request approved",
      data: { rfid, request },
    };
  } catch (error) {
    console.error("RFID status update failed:", error);
    return { success: false, error: "Failed to update RFID status" };
  }
};

type RfidCreateReturnType = {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    rfid: Prisma.RFIDGetPayload<{}>;
    request: Prisma.PendingRfidRequestsGetPayload<{}>;
  };
};

const handleRfidCreateRequest = async (
  requestId: string,
  userId: string,
  tempTagId: string,
  adminId: string
): Promise<RfidCreateReturnType> => {
  try {
    const [rfid, request] = await prisma.$transaction([
      prisma.rFID.create({
        data: {
          tagId: tempTagId,
          active: true,
          userId,
        },
      }),
      prisma.pendingRfidRequests.update({
        where: { id: requestId },
        data: { approvedByAdmin: adminId },
      }),
    ]);

    return {
      success: true,
      message: "RFID created and request approved",
      data: { rfid, request },
    };
  } catch (error) {
    console.error("RFID creation failed:", error);
    return { success: false, error: "Failed to create RFID resource" };
  }
};

type RfidPortReturnType = {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    updated: {
      oldRfid: Prisma.RFIDGetPayload<{}>;
      newRfid: Prisma.RFIDGetPayload<{}>;
    };
    request: Prisma.PendingRfidRequestsGetPayload<{}>;
  };
};

const handleRfidPortRequest = async (
  requestId: string,
  userId: string,
  oldRfidId: string,
  newRfidId: string,
  adminId: string
): Promise<RfidPortReturnType> => {
  try {
    const [oldRfid, newRfid, request] = await prisma.$transaction([
      prisma.rFID.update({
        where: { id: oldRfidId },
        data: { userId: null, active: false },
      }),
      prisma.rFID.update({
        where: { id: newRfidId },
        data: { userId, active: true },
      }),
      prisma.pendingRfidRequests.update({
        where: { id: requestId },
        data: { approvedByAdmin: adminId },
      }),
    ]);

    return {
      success: true,
      message: "RFID ported successfully and request approved",
      data: { updated: { oldRfid, newRfid }, request },
    };
  } catch (error) {
    console.error("RFID port failed:", error);
    return { success: false, error: "Failed to port RFID" };
  }
};
