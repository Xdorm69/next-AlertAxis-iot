import { prisma } from "@/lib/db";
import { getAdmin } from "@/lib/helpers/authHelpers";
import { NextRequest, NextResponse } from "next/server";



export async function GET(request: NextRequest) {
  const admin = await getAdmin();
  if (!admin.success) return NextResponse.json({success: false, error: admin.error}, { status: 401 });
  try {
    const devices = await prisma.device.findMany();
    return NextResponse.json({ success: true, data: devices }, { status: 200 });
  } catch (error) {
    console.log("Error from /api/devices: GET", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
) {
  const admin = await getAdmin();
  if (!admin.success)
    return NextResponse.json(
      { success: false, error: admin.error },
      { status: 401 }
    );

  try {
    const { name, location, status, serialNumber } = await request.json();
    console.log("DATA: ", name, location, status, serialNumber);

    const device = await prisma.device.create({
      data: {
        name,
        location,
        status,
        serialNumber,
        registeredById: admin.data?.id as string,
      },
    });

    return NextResponse.json(
      { success: true, message: "Device created", device },
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
