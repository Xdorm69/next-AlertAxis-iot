import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SyncPage = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  redirect("/onboard");
};

export default SyncPage;
