import { prisma } from "@/lib/db";
import { RequestTypes } from "@prisma/client";

type PendingRequestData = {
  requestType: RequestTypes;
  user: { connect: { id: string } };
  tempTagId?: string;
  rfid?: { connect: { id: string } };
  targetRfid?: { connect: { id: string } };
};

// 🔹 Utility: check duplicate pending request
async function hasDuplicateRequest(
  userId: string,
  requestType: RequestTypes,
  filters: Record<string, any>
) {
  const existing = await prisma.pendingRfidRequests.findFirst({
    where: {
      requestType,
      userId,
      ...filters,
    },
  });
  return existing !== null;
}

export async function handleCreate(tagId: string, userId: string) {
  if (!tagId) return { error: "tagId required", status: 400 };

  const existing = await prisma.rFID.findUnique({ where: { tagId } });
  if (existing) return { error: "RFID already exists", status: 400 };

  // ✅ Prevent duplicate pending CREATE requests
  const duplicate = await hasDuplicateRequest(userId, RequestTypes.CREATE, {
    tempTagId: tagId,
  });
  if (duplicate)
    return { error: "Duplicate CREATE request already pending", status: 400 };

  const data: PendingRequestData = {
    requestType: RequestTypes.CREATE,
    user: { connect: { id: userId } },
    tempTagId: tagId,
  };

  return { data };
}

export async function handleActivate(tagId: string, userId: string) {
  if (!tagId) return { error: "tagId required", status: 400 };

  const existing = await prisma.rFID.findUnique({ where: { tagId } });
  if (!existing) return { error: "RFID not found", status: 404 };
  if (existing.active) return { error: "Already active", status: 400 };
  if (existing.userId !== userId)
    return { error: "Not your RFID", status: 403 };

  // ✅ Prevent duplicate pending ACTIVATE requests
  const duplicate = await hasDuplicateRequest(userId, RequestTypes.ACTIVATE, {
    rfidId: existing.id,
  });
  if (duplicate)
    return { error: "Duplicate ACTIVATE request already pending", status: 400 };

  const data: PendingRequestData = {
    requestType: RequestTypes.ACTIVATE,
    user: { connect: { id: userId } },
    rfid: { connect: { id: existing.id } },
  };

  return { data };
}

export async function handleDeactivate(rfidId: string, userId: string) {
  if (!rfidId) return { error: "rfidId required", status: 400 };

  const existing = await prisma.rFID.findUnique({ where: { id: rfidId } });
  if (!existing) return { error: "RFID not found", status: 404 };
  if (!existing.active) return { error: "Already deactivated", status: 400 };
  if (existing.userId !== userId)
    return { error: "Not your RFID", status: 403 };

  // ✅ Prevent duplicate pending DEACTIVATE requests
  const duplicate = await hasDuplicateRequest(userId, RequestTypes.DEACTIVATE, {
    rfidId: existing.id,
  });
  if (duplicate)
    return {
      error: "Duplicate DEACTIVATE request already pending",
      status: 400,
    };

  const data: PendingRequestData = {
    requestType: RequestTypes.DEACTIVATE,
    user: { connect: { id: userId } },
    rfid: { connect: { id: existing.id } },
  };

  return { data };
}

export async function handlePort(
  rfidId: string,
  targetRfidId: string,
  userId: string
) {
  if (!rfidId || !targetRfidId) {
    return { error: "rfidId and targetRfidId required", status: 400 };
  }

  const source = await prisma.rFID.findUnique({ where: { id: rfidId } });
  if (!source) return { error: "Source not found", status: 404 };
  if (source.userId !== userId) return { error: "Not your RFID", status: 403 };

  const target = await prisma.rFID.findUnique({ where: { id: targetRfidId } });
  if (!target) return { error: "Target not found", status: 404 };
  if (target.active) return { error: "Target already active", status: 400 };

  // ✅ Prevent duplicate pending PORT requests
  const duplicate = await hasDuplicateRequest(userId, RequestTypes.PORT, {
    rfidId,
    targetRfidId,
  });
  if (duplicate)
    return { error: "Duplicate PORT request already pending", status: 400 };

  const data: PendingRequestData = {
    requestType: RequestTypes.PORT,
    user: { connect: { id: userId } },
    rfid: { connect: { id: rfidId } },
    targetRfid: { connect: { id: targetRfidId } },
  };

  return { data };
}
