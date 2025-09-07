import { auth } from "@clerk/nextjs/server";
import { prisma } from "../db";
import { User } from "@prisma/client";

type getAuthReturnType = {
  success: boolean;
  error?: string;
  data?: User;
  message?: string;
};


export async function getUser(): Promise<getAuthReturnType> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "User is not logged In" };

  try {
    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) return { success: false, error: "User is not found in db" };

    return { success: true, data: dbUser };
  } catch (error) {
    console.log("Error from /lib/helpers/getUser: ", error);
    return { success: false, error: "Internal Server Error" };
  }
}


export async function getAdmin(): Promise<getAuthReturnType> {
  try {
    const userFromClerk = await auth();
    const clerkUserId = userFromClerk.userId;
    if (!clerkUserId) return { success: false, error: "Unauthorized" };

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });
    if (!dbUser) return { success: false, error: "No user found in database" };

    if (dbUser.role !== "ADMIN")
      return { success: false, error: "Unauthorized", data: dbUser };

    return { success: true, message: "Admin found", data: dbUser };
  } catch (error) {
    console.log("Error from /api/devices: GET", error);
    return { success: false, error: "Internal Server Error" };
  }
}
