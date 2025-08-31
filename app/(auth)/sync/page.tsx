import { auth } from "@clerk/nextjs/server";
import { Loader } from "lucide-react";
import React from "react";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

const SyncPage = async () => {
  const { userId } = await auth(); // this gives only userId, orgId, etc.
  if (userId) {
    const client = await clerkClient(); // fetch full user details
    const user = await client.users.getUser(userId);
    const { emailAddresses, firstName, lastName } = user;

    try {
      const prevUser = await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

      if (!prevUser) {
        const createdUser = await prisma.user.create({
          data: {
            email: emailAddresses[0].emailAddress,
            name: firstName + " " + lastName,
            clerkId: userId,
          },
        });
        console.log(createdUser);
      }
    } catch (error) {
      console.log("Error syncing user:", error);
    }
  }

  return redirect("/");
};

export default SyncPage;

