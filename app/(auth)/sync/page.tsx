import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SyncPage = async () => {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  const dbUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    }
  })
  if (!dbUser) return redirect("/onboard");

  redirect("/");
};

export default SyncPage;
