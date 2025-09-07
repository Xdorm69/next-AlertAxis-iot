
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

type RfidStatusUpdateReturnType = {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    rfid: Prisma.RFIDGetPayload<{}>;
    request: Prisma.PendingRfidRequestsGetPayload<{}>;
  };
};

export const handleRfidStatusUpdate = async (
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

export const handleRfidCreateRequest = async (
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

export const handleRfidPortRequest = async (
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
