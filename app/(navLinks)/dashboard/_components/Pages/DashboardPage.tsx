
import { cn } from "@/lib/utils";
import DashboardTable from "../DashboardTable";
import { currentUser } from "@clerk/nextjs/server";
import AnimatedHand from "../AnimatedHand";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import SystemAdministeration from "../Admin/SystemAdministeration";
import UserManagement from "../Admin/UserManagement";
import RfidAndDeviceManagement from "../Admin/RfidAndDeviceManagement";

const DashboardPage = async () => {
  const clerkUser = await currentUser();
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser?.id },
  });
  if (!user) return redirect("/sync");

  return (
    <section className="my-18 min-h-[60vh]">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div className="flex items-center justify-between">
          <div className="text-2xl md:text-2xl lg:text-4xl font-bold">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-2">
              Hello!{" "}
              <span className="text-primary">
                {user.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <AnimatedHand />
            </div>{" "}
          </div>
          {/* NEED TO BE GENERATED FROM DB  */}
          <div
            className={cn(
              "rounded-full px-4 py-1 cursor-default w-fit font-semibold border-1 border-ring bg-accent text-foreground transition-shadow duration-300 ease-in-out",
              "hover:shadow-[0px_0px_20px_3px_#000] hover:shadow-primary", // single hover shadow class
              user.role === "ADMIN" &&
                "bg-emerald-800 text-white border-emerald-400 hover:shadow-emerald-400"
            )}
          >
            {user.role}
          </div>
        </div>

        <p className="text-muted-foreground font-mono mt-2 text-sm w-3/4 md:text-md">
          A dashboard presents a summary of system metrics and status.
        </p>

        <div className="mt-12">
          <DashboardTable user={user} />
        </div>
        <>
          {user.role === "ADMIN" && (
            <div className="mt-12">
              <h1 className="text-3xl font-semibold text-accent-foreground">
                Admin Actions 🥊
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <SystemAdministeration />
                <UserManagement />
                <RfidAndDeviceManagement />
              </div>
            </div>
          )}
        </>
      </div>
    </section>
  );
};

export default DashboardPage;
