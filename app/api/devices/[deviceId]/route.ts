import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/helpers/authHelpers";

export async function PATCH(request: NextRequest, context: { params: Promise<{ deviceId: string }> }) {
    const admin = await getAdmin();
    if (!admin.success) return NextResponse.json({success: false, error : admin.error}, {status: 401});

    try {
        const params = await context.params;
        const deviceId = params.deviceId;

        const updated = await prisma.device.findUnique({
            where: {id: deviceId}
        })

        if(!updated) return NextResponse.json({success: false, error: "Device not found"}, {status: 404});

        const {status} = await request.json();

        const updatedDevice = await prisma.device.update({
            where: {id: deviceId},
            data: {
                status
            }
        })

        return NextResponse.json({success: true, message: "Device updated", updatedDevice}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, error: "Internal server error"}, {status: 500});
    }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ deviceId: string }> }
) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );

  try {
    const params = await context.params;
    const deviceId = params.deviceId;

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device)
      return NextResponse.json(
        { success: false, error: "Device not found" },
        { status: 404 }
      );

    const deletedDevice = await prisma.device.delete({
      where: { id: deviceId },
    });

    return NextResponse.json(
      { success: true, message: "Device deleted", deletedDevice },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}


