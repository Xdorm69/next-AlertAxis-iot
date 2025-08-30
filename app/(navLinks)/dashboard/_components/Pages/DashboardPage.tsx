
import React from "react";
import { cn } from "@/lib/utils";
import DashboardTable from "../DashboardTable";
import { currentUser } from "@clerk/nextjs/server";
import AnimatedHand from "../AnimatedHand";

const DashboardPage = async () => {
  const clerkUser = await currentUser();
  const user = {role: "USER", name: clerkUser?.fullName || "GUEST"};

  return (
    <section className="min-h-screen mt-18">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold flex gap-2">
            <h1>Hello! {user.name}</h1> <AnimatedHand />
          </div>
          {/* NEED TO BE GENERATED FROM DB  */}
          <div
            className={cn(
              "rounded-full px-4 py-1 cursor-default w-fit font-semibold border-1 border-ring bg-accent text-white transition-shadow duration-300 ease-in-out",
              "hover:shadow-[0px_0px_20px_3px_#000] hover:shadow-primary", // single hover shadow class
              user.role === "ADMIN" &&
                "bg-emerald-800 border-emerald-400 hover:shadow-emerald-400"
            )}
          >
            {user.role}
          </div>
        </div>

        <p className="text-muted-foreground font-mono mt-2">
          A dashboard presents a summary of system metrics and status.
        </p>

        <div className="mt-12">
          <DashboardTable user={user} />
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
