import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const data = [
      {
        username: "Amitoj",
        userId: "383ohf0ja",
        rfidId: Math.random().toString(36).substring(7),
        id: "1224",
        requestType: "ACTIVATE",
      },
      {
        username: "Amitoj",
        userId: "383ohf0ja",
        rfidId: Math.random().toString(36).substring(7),
        id: "1224",
        requestType: "DISABLE",
      },
      {
        username: "Amitoj",
        userId: "383ohf0ja",
        rfidId: Math.random().toString(36).substring(7),
        id: "1224",
        requestType: "ACTIVATE",
      },
      {
        username: "Amitoj",
        userId: "383ohf0ja",
        rfidId: Math.random().toString(36).substring(7),
        id: "1224",
        requestType: "ACTIVATE",
      },
    ];
    return NextResponse.json({success: true, message: "Pending requests fetched successfully", data});
}